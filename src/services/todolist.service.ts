import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from 'src/models/item.model';

@Injectable()
export class TodolistService {
    constructor(private http: HttpClient) { }

    configUrl = 'https://todo-backend-express.herokuapp.com/';

    getItem() {
        return this.http.get(this.configUrl);
    }

    setItem(body: any){
        return this.http.post(this.configUrl, body)
    }

    checkItem(url: string, flag: boolean){
        return this.http.patch(url, {completed: flag})
    }

    deleteItem(url: string){
        return this.http.delete(url)
    }
}

