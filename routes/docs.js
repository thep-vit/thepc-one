//API Documentation
/**
 * @api {post} /api/newEvent
 * @apiName GoogleOAuth
 * @apiGroup Events
 *
 * @apiParam {String} eventName          Mandatory event name.
 * @apiParam {String} eventDesc          Mandatory event description.
 * @apiParam {String} eventLink          Mandatory  event link.
 * 
 * @apiSuccess {Boolean} approved Approval status of the event.
 * @apiSuccess {mongoID} _id  mongoID of the user object.
 * @apiSuccess {String} eventDesc Event description.
 * @apiSuccess {String} eventLink Link for the event.
 * @apiSuccess {String} eventName Name of the event.
 * @apiSuccess {Date} dateCreated Date of creation of the event.
 * @apiSuccess {String} token auth tokens array
 *
 * @apiSuccessExample newEvent:
 *     {
 *   "approved": false,
 *    "_id": "5f6870823dcf5d40a0fa6d28",
 *   "eventDesc": "ABC Event",
 *   "eventLink": "https://www.com",
 *   "eventName": "ABC",
 *   "dateCreated": "2020-09-21T09:21:06.111Z",
 *   "__v": 0
}
 *
 * @apiError authError Please authenticate.
 * @apiError adminError You do not have admin rights.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 **/
/**
 * @api {patch} /api/approveEvent/:id
 * @apiName THEPC One
 * @apiGroup Events
 * 
 * @apiParam {String} id eventID which is stored as mongoID on teh database.
 * @apiSuccess {Boolean} approved Approval status of the event.
 * @apiSuccess {mongoID} _id  mongoID of the user object.
 * @apiSuccess {String} eventDesc Event description.
 * @apiSuccess {String} eventLink Link for the event.
 * @apiSuccess {String} eventName Name of the event.
 * @apiSuccess {Date} dateCreated Date of creation of the event.
 * @apiSuccess {String} token auth tokens array
 * @apiSuccessExample approvedEvent:
 *     {
 *   "approved": true,
 *    "_id": "5f6870823dcf5d40a0fa6d28",
 *   "eventDesc": "ABC Event",
 *   "eventLink": "https://www.com",
 *   "eventName": "ABC",
 *   "dateCreated": "2020-09-21T09:21:06.111Z",
 *   "__v": 0
}
 *
 * @apiError authError Please authenticate.
 * @apiError adminError You do not have admin rights.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 **/
/** 
 * @api {get} /google/verified
 * @apiName GoogleOAuth
 * @apiGroup User
 *
 * @apiSuccess {Integer} memberType member classifications of Users.
 * @apiSuccess {mongoID} _id  mongoID of the user object.
 
 *
 * @apiSuccessExample newEvent:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 **/