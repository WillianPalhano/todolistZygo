import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from 'src/models/task.model';

@Injectable()
export class TodolistService {
    constructor(private http: HttpClient) { }

    configUrl = 'https://todo-backend-express.herokuapp.com/';

    getTask() {
        return this.http.get(this.configUrl);
    }

    setTask(body: any){
        return this.http.post(this.configUrl, body)
    }

    editTask(task: Task){
        return this.http.patch(task.url, task)
    }

    deleteTask(url: string){
        return this.http.delete(url)
    }
}

