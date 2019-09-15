# icalender


> 一个可以标记日期范围的vue日历插件

## Usage

### Install

```bash
npm install icalender --save
```

```js
// 全局使用
import icalender from 'icalender';

Vue.use(icalender);
```

### CommonJS

```javascript
var icalender = require('icalender');

new Vue({
    components: { icalender },
    data: function () {
        return {
            marks: [
                {
                    start: "2019-09-02",
                    end: "2019-09-05"
                },
                {
                    start: "2019-09-12",
                    end: "2019-09-12"
                },
                {
                    start: "2019-09-15",
                    end: "2019-09-24"
                }
            ]
        };
    },
    template: '<icalender :marks="marks" />'
});
```

### ES6
```javascript
import icalender from 'icalender';

new Vue({
    components: { icalender },
    data: function () {
        return {
            marks: [
                {
                    start: "2019-09-02",
                    end: "2019-09-05"
                },
                {
                    start: "2019-09-12",
                    end: "2019-09-12"
                },
                {
                    start: "2019-09-15",
                    end: "2019-09-24"
                }
            ]
        };
    },
    template: '<icalender :marks="marks" />'
});
```

### Props

| Property | Description |
|:--|:--|
| marks | 可选，标记日期范围的数组 |

## License

[MIT](http://opensource.org/licenses/MIT)