<template>
  <div class="icalender">
    <div class="icalender-header">
      <div class="arrow" @click="back">
        <svg fill="transparent" viewBox="0 0 30 30">
          <polyline points="20,5 10,15 20,25" stroke="#dcdcdc" stroke-width="4"></polyline>
        </svg>
      </div>
      <div class="title">
        {{ year }}年{{ month_list[month] }}月
      </div>
      <div class="arrow" @click="forward">
        <svg fill="transparent" viewBox="0 0 30 30">
          <polyline points="10,5 20,15 10,25" stroke="#dcdcdc" stroke-width="4"></polyline>
        </svg>
      </div>
    </div>

    <div class="icalender-body">
      <div class="week-head">
        <div class="week-item" v-for="item in week_list" :key="item">{{ item }}</div>
      </div>
      <table>
        <tr v-for="(item,index) in list" :key="index">
          <td v-for="(it,idx) in item" :key="idx" :class="{'active-bg': it.active, 'td': it.day}" @click="handleClick(it)">
            <div class="point">
              <div :class="now==it.full_day?'now-point':''"></div>
              <div :class="{'is-point':it.point, 'active-point': active==it.full_day}"></div>
              <span class="date-label" :active="it.point||active==it.full_day" :title="it.full_day">{{ it.day }}</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "icalender",
  props: {
    marks: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      active: undefined,
      now: "",
      year: "",
      month: 0,
      month_list: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      week_list: ["日", "一", "二", "三", "四", "五", "六"],
      list: []
    }
  },
  watch: {
    marks: {
      handler(val) {
        this.getDayList(this.year, this.month);
      },
      deep: true
    }
  },
  methods: {
    handleClick(data) {
      if(!data.day) return false;
      this.active = data.full_day;
      this.$emit("on-click", data);
    },
    back() {
      if(this.month == 0){
        this.year = this.year == "1970" ? "1970" : (parseInt(this.year) - 1).toString();
        this.month = 11;
      } else {
        this.month -= 1;
      }
      this.$emit("forward", {
        year: this.year,
        month: this.month_list[this.month]
      })
      this.getDayList(this.year, this.month);
    },
    forward() {
      if(this.month == 11){
        this.year = (parseInt(this.year) + 1).toString();
        this.month = 0;
      } else {
        this.month += 1;
      }
      this.$emit("back", {
        year: this.year,
        month: this.month_list[this.month]
      })
      this.getDayList(this.year, this.month);
    },
    getCurrentMonth() {
      let date = new Date();
      return date.getMonth();
    },
    getCurrentYear() {
      let date = new Date();
      return date.getFullYear();
    },
    /** 
     * @return 当前日期某天
    */
    getCurrentDate() {
      let date = new Date();
      return date.getDate();
    },
    /** 
     * @return 当前日期星期
    */
    getCurrentDay() {
      let date = new Date();
      return date.getDay();
    },
    getDayList(year, month) {
      if(arguments.length < 2) throw new Error("getDayList必须传入两个参数year和month");
      let counts = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 每年月份天数
      let date = new Date();
      this.list = [];
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        counts[1] = 29;
      }
      // 根据当前月1号是星期几 判断需要绘制几列
      let this_week = new Date(year, month, 1).getDay(); // 当前月1号是星期几
      let i_list = []
      for(let i=0;i<this_week;i++){
        i_list.push("")
      }
      for(let i = 0;i < counts[month];i++) {
        i_list.push(i+1);
      }
      let arr = []
      for(let i = 0;i < i_list.length;i++) {
        if (i > 0 && i % 7 == 0) { // 每7分隔为一个数组
          this.list.push(arr)
          arr = []
        }
        let obj = {
          year: year, // 年份
          month: month, // 月份，范围0～11
          day: i_list[i], // 日份
          full_day: "", // 完整日期格式，例如：2019-09-15
          point: false, //标记一天
          active: false //标记日期范围
        }
        
        if (i_list[i] != '') {
          let day = i_list[i] >= 10 ? i_list[i] : "0" + i_list[i];
          obj.full_day = year + "-" + this.month_list[month] + "-" + day;
        }
        //  标记日期 start
        /**
         * 标记日期分为四种情况：
         * 1. 开始时间和结束时间都在当前月内
         * 2. 开始时间在当前月内，结束时间不在当前月内
         * 3. 开始时间不在当前月内，结束时间在当前月内
         * 4. 开始时间和结束时间范围包含当前月
         */
        let marks = this.marks;
        try {
          for(let i=0;i<marks.length;i++){
            let c_start = new Date(marks[i].start.replace(/-/g, "/"));
            let c_end = new Date(marks[i].end.replace(/-/g, "/"));
            if (c_start.getTime() > c_end.getTime()) {
              throw "开始日期start日期不能超过结束日期end";
            }
            
            if (obj.day) {
              let now = new Date(obj.full_day.replace(/-/g, "/"));
              if (obj.full_day === marks[i].start && obj.full_day == marks[i].end) {
                obj.point = true;
              } else if (now.getTime() >= c_start.getTime() && now.getTime() <= c_end.getTime()) {
                obj.active = true;
              }
            }
          }
        } catch(err) {
          console.error(err)
        }
        //  标记日期 end
        arr.push(obj);
      }
      this.list.push(arr);
    }
  },
  created() {
    let date = new Date();
    this.month = date.getMonth();
    this.year = date.getFullYear().toString();
    let day = date.getDate();
    day < 10 && (day = "0" + day)
    this.now =  this.year + "-" + this.month_list[this.month] + "-" + day;
    this.getDayList(this.year, this.month);
  }
}
</script>

<style scoped>
svg{
  width: 12px;
  height: 12px;
  vertical-align: middle;
}

.arrow{
  display: inline-block;
  background-color: rgba(31,45,61,.11);
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  transition: .2s;
  cursor: pointer;
}

.arrow:hover{
  background-color: rgba(31,45,61,.5);
}

.title{
  display: inline-block;
  margin: auto 0;
  text-align: center;
  flex: 1;
  font-weight: 500;
}

.icalender{
  width: 100%;
  min-width: 260px;
  user-select: none;
}

.icalender-header{
  display: flex;
}

.icalender-body{
 padding: 10px 5px;
}
.icalender-body table{
  width: 100%;
  border-collapse: collapse;
}

.icalender-body td{
  text-align: center;
}

.week-head{
  display: flex;
  justify-content: space-around;
  font-weight: 500;
}

.point{
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-weight: 500;
  cursor: pointer;
}
.td:hover{
  background-color: rgba(42, 96, 211, 0.5);
}
.is-point{
  position: absolute;
  border-radius: 50%;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #D0494D;
  z-index: 2;
  transform: scale(.9);
}

.active-point{
  position: absolute;
  border-radius: 50%;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(12, 69, 155);
  z-index: 2;
  transform: scale(.9);
}

.now-point{
  position: absolute;
  border: 3px solid rgb(25, 80, 180);
  right: 0;
  top: 0;
  border-radius: 50%;
}

.date-label{
  position: relative;
  z-index: 4;
}

.date-label[active]{
  color: #dcdcdc;
}

.active-bg{
  background-color: #F1868D;
  color: #dcdcdc;
}
</style>
