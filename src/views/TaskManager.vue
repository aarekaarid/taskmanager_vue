<template>
  <div class="home">
    <h2>TaskManager 1.0</h2>
    <input v-model="task_name" placeholder="enter task description">
    <datetime
        v-model="task_deadline"
        type="datetime"
        title ="pick date and time"
        input-id="startDate"
        value-zone="local"
    >
      <label for="startDate" slot="before">Pick Date and Time</label>
      <template slot="button-cancel">
        Cancel
      </template>
      <template slot="button-confirm">
        Confirm
      </template>
    </datetime>
    <button v-on:click="createTask()">Create Task</button>
    <br>
    <h3>
      CURRENT TABLE OF TASKS FROM DATABASE
    </h3>
    <table align="center" border="1">
      <tr>
        <th>No.</th>
        <th>Description</th>
        <th>Created</th>
        <th>Deadline</th>
      </tr>
      <tr v-for="(row, index) in tasksList"
        :class="{task_red: moment(row.taskDeadline).diff(moment(), 'minutes') <= 60}">
        <th>{{ index + 1 }}</th>
        <th align="left">{{ row.taskName }}</th>
        <th>{{ moment(row.taskCreated).local().format('yyyy-MM-DD HH:mm') }}</th>
        <th>{{ moment(row.taskDeadline).local().format('yyyy-MM-DD HH:mm') }}</th>
        <th>
          <button v-on:click="updateStatus(row)">DONE</button>
        </th>
      </tr>
    </table>
    <br>
    <br>
  </div>
</template>

<script>
import moment from 'moment';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'

//RETURNING TASKS LIST FROM DB
let returnTasks = function (response) {
  this.tasksList = response.data;
}

//CREATING NEW TASK
let createTask = function () {
  let url = this.$host + "/task";
  let requestParams = {
    params: {
      task_name: this.task_name,
      task_deadline_string: this.task_deadline,
    }
  }
  this.$http.post(url, {}, requestParams).then(this.displayTasks).catch(function (error) {
        alert(JSON.stringify(error.response.data))
        });
  this.task_name = "";
  this.task_deadline = "";
}

//UPDATING TASK STATUS TO DONE
let updateStatus = function (row, index) {
  let url = this.$host + "/status/update";
  let requestParams = {
    params: {
      id: row.id,
    }
  };
  this.$http.put(url, {}, requestParams).then(this.displayTasks);
}

//BRINGING TASKS FROM DB
let displayTasks = function () {
  let url = this.$host + "/task/table";
  this.$http.get(url).then(this.returnTasks);
}

let returnError = function (error) {
  this.errorMessage = error.error;
}

export default {
  name: 'Home',
  methods: {
    createTask: createTask,
    returnTasks: returnTasks,
    displayTasks: displayTasks,
    updateStatus: updateStatus,
    moment: moment,
    returnError: returnError,
  },
  components: {
    datetime: Datetime,
  },
  data: function(){
    return{
    task_name: '',
    task_deadline: '',
    tasksList: [],
    errorMessage: "",
    }
  },
  created() {
    this.displayTasks();
  }
}
</script>

<style scoped>
#keywords {
  font-size: 16px;
}

.task_red {
  background: red;
}
</style>