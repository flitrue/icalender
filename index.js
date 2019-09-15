/**
 * Created by flitrue on 2019/09/14.
 */
import icalender from './src/icalender.vue'
icalender.install = function (Vue) {
  Vue.component(icalender.name, icalender)
}
export default icalender