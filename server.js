/**
 * Created by BadWaka on 2017/2/11.
 */
import express from 'express';
import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb://localhost/blog_waka');

const port = process.env.PORT || 3000;
app.listen(port);
