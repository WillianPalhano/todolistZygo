import { Component } from '@angular/core';
import { Task } from 'src/models/task.model';
import { TodolistService } from 'src/services/todolist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Todo List';
  allTasks: Task[] = []
  todoTasks: Task[] = []
  doneTasks: Task[] = []

  //Control the list in the view
  controlView = {
    allTasks: true,
    todoTasks: false,
    doneTasks: false
  }

  //Variables
  newTask: string = ""
  edit = false
  editTitle = ""
  opened: boolean = false

  //Display message
  display: boolean = false
  msg: string = ""

  constructor(
    private todolistService: TodolistService
  ){
    this.getTasks()
  }

  changeList(type: number){
    if(type == 1){
      this.controlView.allTasks = true
      this.controlView.todoTasks = false
      this.controlView.doneTasks = false
    } else if(type == 2){
      this.controlView.allTasks = false
      this.controlView.todoTasks = true
      this.controlView.doneTasks = false
    } else {
      this.controlView.allTasks = false
      this.controlView.todoTasks = false
      this.controlView.doneTasks = true
    }
  }

  getTasks(){
    this.todolistService.getTask().subscribe(res => {      
      this.allTasks = res as Task[]
      this.saveTasks()
    }, err => {
      this.displayMessage( err)
    })
  }
  
  saveTasks(){
    this.doneTasks = []
    this.todoTasks = []
    this.allTasks.forEach(task => {
      if(task.completed){
        this.doneTasks.push(task)
      }else{
        this.todoTasks.push(task)
      }
    });
    localStorage.setItem("allTasks", JSON.stringify(this.allTasks))
    localStorage.setItem("todoTasks", JSON.stringify(this.todoTasks))
    localStorage.setItem("doneTasks", JSON.stringify(this.doneTasks))
  }

  createTask(){
    if(this.newTask == ""){
      this.displayMessage( "Please, insert a title to your task.")
      return
    }
    let item = {
      completed: false,
      order: this.allTasks.length,
      title: this.newTask,
      url: ""
    }
    this.allTasks.push(item)
    this.saveTasks()

    this.todolistService.setTask(item).subscribe(res => {
      this.getTasks()
      this.newTask = ""
    }, err => {
      this.displayMessage( err)
    })
  }

  editTask(item: Task){
    if(this.editTitle == item.title){
      //The title doesn't change
      this.editTitle = ""
      this.edit = false
      return
    }
    let index = this.allTasks.indexOf(item)
    this.todolistService.editTask(item).subscribe(res =>{
      this.allTasks[index] = res as Task
      this.saveTasks()
      this.getTasks()
    }, err => {
      this.displayMessage( err)
    })
    this.edit = false
  }

  checkTask(item: Task){
    let index = this.allTasks.indexOf(item)
    item.completed = !item.completed
    this.todolistService.editTask(item).subscribe(res =>{
      this.allTasks[index] = res as Task
      this.saveTasks()
      this.getTasks()
    }, err => {
      this.displayMessage( err)
    })
  }

  deleteTask(item: Task){
    let index = this.allTasks.indexOf(item)
    this.allTasks.splice(index, 1)
    this.saveTasks()
    this.todolistService.deleteTask(item.url).subscribe(res =>{
      this.getTasks()
    }, err => {
      this.displayMessage( err)
    })
  }

  async deleteAllTasks(){
    let urlDelete = []

    for (let i = 0; i < this.doneTasks.length; i++) {
      urlDelete.push(this.doneTasks[i].url)
    }
    this.displayMessage("Carregando...")
    this.todolistService.deleteAllTasks(urlDelete).subscribe(res =>{
      console.log(res);
      this.displayMessage("Finalizado!")
      this.getTasks()
    }, err => {
      this.displayMessage(err)
    })
  }

  displayMessage(text: string){
    this.display = true
    this.msg = text

    setTimeout(() => {
      this.display = false
      this.msg = ""
    }, 2500);
  }
}
