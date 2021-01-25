import { Component } from '@angular/core';
import { Item } from 'src/models/item.model';
import { TodolistService } from 'src/services/todolist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todolistZygo';
  items: Item[] = []
  newItem: string = ""

  constructor(
    private todolistService: TodolistService
  ){
    this.getItems()
  }

  getItems(){
    this.todolistService.getItem().subscribe(res => {      
      this.items = res as Item[]
      // this.items.sort((a ,b) => a.order - b.order)
      console.log(this.items);
    })
  }

  createItem(){
    let item = {
      completed: false,
      order: this.items.length,
      title: this.newItem
    }
    // if(this.items.length == 0){
    //   item.order = 0
    // } else {
    //   item.order = this.items.length + 1
    // }

    this.todolistService.setItem(item).subscribe(res => {
      console.log(res);
      this.getItems()
      this.newItem = ""
    }, err => {
      console.log(err);
    })
  }

  checkItem(item: Item){
      this.todolistService.checkItem(item.url, !item.completed).subscribe(res =>{
        console.log(res);
        this.getItems()
      })
  }

  deleteItem(item: Item){
    this.todolistService.deleteItem(item.url).subscribe(res =>{
      console.log(res);
      this.getItems()
    })
  }
}
