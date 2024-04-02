const { Router } = require('express');
const { validate } = require('../../validation/index.js');
const signupController = require('../../controllers/v1/signup.controller.js');
const { fileUploader, UploadConfiguration } = require('../../helper/fileUpload.js');

const uploadProfilePic = new UploadConfiguration({
    fieldName: 'Profile',
    maxCount: 1,
    isMandatory: true,
    targetDir: "Profile",
    allowedFileType: [
        'jpg',
        'jpeg',
        'image/jpeg'
    ]
});
class SignupRoute {
    route;

    constructor() {
        this.route = Router();
        this.#handleRoutes();
    }

    #handleRoutes() {
        this.route.post('/user',fileUploader.startUpload(uploadProfilePic), validate('signup.schema', 'create'), signupController.createUser);
    }
}

module.exports = new SignupRoute().route;
