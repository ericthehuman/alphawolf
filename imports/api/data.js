import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';



export const Data = new Mongo.Collection('ddata');
export const Companies = new Mongo.Collection('comps');


export const SelectedStock = new ReactiveVar({code: "HOME", data: ""});
export const Stocks = new Mongo.Collection('stocks');
export const ModalVar = new ReactiveVar({isOpen: false})

