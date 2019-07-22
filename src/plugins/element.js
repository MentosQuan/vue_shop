import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Main,
  Header,
  Aside,
  Container,
  Menu,
  Submenu,
  MenuItem,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Tree,
  Select
} from 'element-ui'

Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Main)
  .use(Aside)
  .use(Header)
  .use(Container)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Row)
  .use(Col)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Tooltip)
  .use(Pagination)
  .use(Dialog)
  .use(Tag)
  .use(Tree)
  .use(Select)



Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
