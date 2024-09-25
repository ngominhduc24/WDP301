"use strict"

const response =  {
    errorResponse: (statusCode, error) => {
        let errorResponse = {};
        switch (statusCode) {
            case 400:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Bad Request' });
                break;
            case 401:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Unauthorized' });
                break;
            case 403:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Forbidden' });
                break;
            case 404:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Not Found' });
                break;
            default:
                errorResponse = Object.assign({}, { success: false, statusCode: statusCode || 500, error: error || 'Error' });
                break;
        }
        return errorResponse;
    },

    successResponse: (statusCode, data, message) => {
        let successResponse = {};
        switch (statusCode) {
            case 201:
                successResponse = Object.assign({}, { statusCode, message: message || 'Created', data: data || ''});
                break;
            case 202:
                successResponse = Object.assign({}, { statusCode, message: message || 'Accepted', data: data || ''});
                break;
            case 204:
                successResponse = Object.assign({}, { statusCode, message: message || 'Updated', data: data || ''});
                break;
            default:
                successResponse = Object.assign({}, { statusCode: statusCode || 200, message: message || 'Success', data: data || ''});
                break;
        }
        return successResponse;
    },
}

export default response