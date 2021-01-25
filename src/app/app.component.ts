import { Component } from '@angular/core';
import { Task } from 'src/models/task.model';
import { TodolistService } from 'src/services/todolist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todolistZygo';
  allTasks: Task[] = []
  todoTasks: Task[] = []
  doneTasks: Task[] = []

  controlView = {
    allTasks: true,
    todoTasks: false,
    doneTasks: false
  }
  newTask: string = ""
  edit = false
  opened: boolean = false

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
      console.log(this.allTasks);
    })
  }
  
  saveTasks(){
    console.log("Entrou aqui");
    
    this.doneTasks = []
    this.todoTasks = []
    this.allTasks.forEach(task => {
      if(task.completed){
        this.doneTasks.push(task)
      }else{
        this.todoTasks.push(task)
      }
    });
    console.log("Todas aqui: ", this.allTasks);
    console.log("todo aqui: ", this.todoTasks);
    console.log("done aqui: ", this.doneTasks);
    localStorage.setItem("allTasks", JSON.stringify(this.allTasks))
    localStorage.setItem("todoTasks", JSON.stringify(this.todoTasks))
    localStorage.setItem("doneTasks", JSON.stringify(this.doneTasks))
  }

  createTask(){
    let item = {
      completed: false,
      order: this.allTasks.length,
      title: this.newTask,
      url: ""
    }
    this.allTasks.push(item)
    this.saveTasks()

    this.todolistService.setTask(item).subscribe(res => {
      console.log(res);
      this.getTasks()
      this.newTask = ""
    }, err => {
      console.log(err);
    })
  }

  editTask(item: Task){
    let index = this.allTasks.indexOf(item)
    this.todolistService.editTask(item).subscribe(res =>{
      console.log(res);
      this.allTasks[index] = res as Task
      this.saveTasks()
      this.getTasks()
    })
    this.edit = false
  }

  checkTask(item: Task){
    let index = this.allTasks.indexOf(item)
    item.completed = !item.completed
    this.todolistService.editTask(item).subscribe(res =>{
      console.log(res);
      this.allTasks[index] = res as Task
      this.saveTasks()
      this.getTasks()
    })
  }

  deleteTask(item: Task){
    let index = this.allTasks.indexOf(item)
    this.allTasks.splice(index, 1)
    this.saveTasks()
    this.todolistService.deleteTask(item.url).subscribe(res =>{
      console.log(res);
      this.getTasks()
    })
  }
}
