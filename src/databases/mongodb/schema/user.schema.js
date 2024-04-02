const mongoose = require('mongoose');

class UserSchema {
    Schema;

    constructor() {
        this.#createModel();
    }

    #createModel() {
        this.#getUserSchema();
        this.#createIndexes();
        this.#registerHooks();
    }

    #getUserSchema() {
        this.Schema = new mongoose.Schema(
            {
                userName: {
                    type: String,
                    required: true
                },
                emailId: {
                    type: String,
                    required: true,
                    unique: true
                },
                contactNo: {
                    type: String
                },
                gender: {
                    type: String,
                    required: true ,
                    enum: ["male", "female", "trans"]
                },
                password: {
                    type: String,
                    required: true
                },
                profilePic: {
                    type: String,
                    required: true
                },
                role: {
                    type: Number
                }
            },
            {
                timestamps: true
            }
        );
    }

    #createIndexes() {
        this.Schema.index({
            emailId: 1,
        });
    }

    #registerHooks() {
        // this is dummy function
    }
}

module.exports = UserSchema;
