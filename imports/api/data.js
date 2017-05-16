import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';



export const Data = new Mongo.Collection('ddata');
export const Companies = new Mongo.Collection('comps');

export const News = new ReactiveVar([{code: "CBA.AX", data: ""}]);
export const SelectedStock = new ReactiveVar([{code: "Home", data: ""}]);
export const Stocks = new Mongo.Collection('stocks');
export const ActiveStocks = new Mongo.Collection('activeStocks');
export const ModalVar = new ReactiveVar({isOpen: false})
