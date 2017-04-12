import { Mongo } from 'meteor/mongo';


export const Data = new Mongo.Collection('ddata');
export const Companies = new Mongo.Collection('comps');

