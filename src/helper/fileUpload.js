/* eslint-disable max-classes-per-file */
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const util = require('util');
const CONFIG = require('../../config/config');
const responseHandler = require('../middlewares/responseHandler.middleware');

class UploadConfiguration {

    constructor({ fieldName, maxCount, isMandatory, targetDir, allowedFileType }) {
        this.fieldName = fieldName;
        this.maxCount = maxCount;
        this.isMandatory = isMandatory;
        this.targetDir = targetDir;
        this.allowedFileType = allowedFileType;
    }
}

class FileUploader {

    startUpload(uploadConfigurations) {
        return async (req, res, next) => {
            try {
                const filesMountPoint = CONFIG.FILES.MOUNT_POINT;
                const mountPointPath = path.resolve(filesMountPoint);

                // get separater according to operating system
                const { sep } = path;

                // create targetDirectoryPath
                const targetDirPath = `${mountPointPath}${sep}${uploadConfigurations.targetDir}`

                // Create Target Directory if not present
                const initialDirectory = path.isAbsolute(targetDirPath) ? sep : '';
                targetDirPath.split(sep).reduce((parentDir, childDir) => {
                    const curDir = path.resolve(parentDir, childDir);
                    if (!fs.existsSync(curDir)) {
                        fs.mkdirSync(curDir);
                    }
                    return curDir;
                }, initialDirectory);

                const multerFileUpload = multer({
                    storage: multer.diskStorage({
                        destination: (req, file, cb) => {
                            cb(null, targetDirPath);
                        },
                        filename: (req, file, cb) => {
                            cb(null, `${Date.now()}_${file.originalname}`);
                        }
                    }),
                    limits: {
                        fileSize: 8000000,
                    },
                    fileFilter: (req, file, cb) => {
                        /** Check for filename length */
                        if (file.originalname.length > 255) {
                            const err = 'File name is too long';
                            return cb(err, false);
                        }
                        /** Check for more than one extension */
                        if (file.originalname.split('.').length > 2) {
                            const err = 'Only one extension is allowed';
                            return cb(err, false);
                        }
                        /** Check allowed file types */
                        const allowedFileType = uploadConfigurations.allowedFileType;
                        if (file.mimetype) {
                            if (allowedFileType.includes(file.mimetype.toLowerCase())) { return cb(null, true); }

                            const err = `Only ${allowedFileType} are allowed`;
                            return cb(err, false);
                        }
                        return cb(null, true);
                    },
                    onError: function onError(err) {
                        console.log('error', err);
                    },
                });


                req.headers.fileDetails = {
                    fieldName: uploadConfigurations.fieldName,
                    targetDirPath: targetDirPath,
                    isMandatory: uploadConfigurations.isMandatory,
                    allowedFileType: uploadConfigurations.allowedFileType
                };

                const fileUpload = util.promisify(multerFileUpload.array(req.headers.fileDetails.fieldName));

                await fileUpload(req, res);
                // Note: access files data from req.files array

                if (req.headers.fileDetails.isMandatory && (!req.files || req.files.length === 0)) {
                    res.locals.err = 'Mandatory file is missing'
                    return responseHandler(req, res);
                }

                return next();
            } catch (e) {
                console.log("FILE UPLOAD ERROR >> ", e.message, e, JSON.stringify(e));
                if (e?.code === 'LIMIT_FILE_SIZE') {
                    res.locals.err = 'File is too large';
                    return responseHandler(req, res);
                }
                else if (e?.code === 'LIMIT_UNEXPECTED_FILE') {
                    res.locals.err = 'Invalid file name';
                    return responseHandler(req, res);
                }
                res.locals.err = e;
                return responseHandler(req, res);
            }
        };
    }
}

const fileUploader = new FileUploader();
module.exports = {
    fileUploader,
    UploadConfiguration,
};
