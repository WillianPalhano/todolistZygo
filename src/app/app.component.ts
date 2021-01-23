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

  constructor(
    private todolistService: TodolistService
  ){
    this.getItems()
  }

  getItems(){
    this.todolistService.getItem().subscribe(res => {      
      this.items = res as Item[]
      this.items.sort((a ,b) => a.order - b.order)
      console.log(this.items);
    })
  }

  createItem(){
    let item = {
      completed: false,
      order: this.items.length,
      title: "Teste"
    }
    // if(this.items.length == 0){
    //   item.order = 0
    // } else {
    //   item.order = this.items.length + 1
    // }

    this.todolistService.setItem(item).subscribe(res => {
      console.log(res);
      this.getItems()
    }, err => {
      console.log(err);
    })
  }

  checkItem(flag: boolean){
      this.todolistService.checkItem(this.items[1].url, flag).subscribe(res =>{
        console.log(res);
        this.getItems()
      })
  }

  deleteItem(){
    this.todolistService.deleteItem(this.items[0].url).subscribe(res =>{
      console.log(res);
      this.getItems()
    })
  }
}
