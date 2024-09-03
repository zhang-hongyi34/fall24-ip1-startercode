import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app, server } from '../server';
import * as util from '../models/application';
import { Question } from '../types';

const saveAnswerSpy = jest.spyOn(util, 'saveAnswer');
const addAnswerToQuestionSpy = jest.spyOn(util, 'addAnswerToQuestion');

describe('POST /addAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    server.close();
  });

  it('should add a new answer to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ans_by: 'dummyUserId',
        ans_date_time: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ans_by: 'dummyUserId',
      ans_date_time: new Date('2024-06-03'),
    };
    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      asked_by: 'dummyUserId',
      ask_date_time: new Date('2024-06-03'),
      views: 0,
      up_votes: [],
      down_votes: [],
      answers: [mockAnswer],
    } as Question);

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ans_by: 'dummyUserId',
      ans_date_time: mockAnswer.ans_date_time.toISOString(),
    });
  });

  it('should return bad request error if answer text property is missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        ans_by: 'dummyUserId',
        ans_date_time: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid answer');
  });

  it('should return bad request error if request body has qid property missing', async () => {
    const mockReqBody = {
      ans: {
        ans_by: 'dummyUserId',
        ans_date_time: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ans_by property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ans_date_time: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ans_date_time property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ans_by: 'dummyUserId',
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/answer/addAnswer');

    expect(response.status).toBe(400);
  });

  it('should return database error in response if saveAnswer method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ans_by: 'dummyUserId',
        ans_date_time: new Date('2024-06-03'),
      },
    };

    saveAnswerSpy.mockRejectedValueOnce(new Error('Database error'));

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if update question method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ans_by: 'dummyUserId',
        ans_date_time: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ans_by: 'dummyUserId',
      ans_date_time: new Date('2024-06-03'),
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockRejectedValueOnce(new Error('Database error'));

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });
});
