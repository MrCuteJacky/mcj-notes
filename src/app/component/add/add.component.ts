import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  @Output()
  onAdd = new EventEmitter();

  title: string;
  message: string;

  constructor() { }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.title = null;
    this.message = null;
  }

  add(): void {
    var data = {
      title: this.title,
      message: this.message
    };
    this.onAdd.emit(data);
    this.init();
  }

}
