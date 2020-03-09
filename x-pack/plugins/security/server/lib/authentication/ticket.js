import _ from 'lodash';

/*
 * cgh 2020年3月6日15:39:46
 * 增加一个ticket类来存放一次性ticket
 */
 

function assertRequest(request) {
  if (!request || typeof request !== 'object') {
    throw new Error(`Request should be a valid object, was [${typeof request}].`);
  }
} 

// 创建随机的hash
function createHash(hashLength) {
　　// 默认长度 24
    return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join('');
}
  

/**
 * Manages Kibana user Ticket.
 */
export class Ticket {
  
   /**
   * HapiJS server instance.
   * @type {Object}
   * @private
   */
  _server = null;

   /**
   * 一次性的ticket
   * @type {Object}
   * @private
   */
  _ticketStore={}

  /**
   * 
   * 
   */
  constructor(server) {
    this._server = server; 
  } 
  /**
   * Retrieves session value from the session storage (e.g. cookie).
   * @param {Hapi.Request} request HapiJS request instance.
   * @returns {Promise.<any>}
   */
  get(request) {
    assertRequest(request);

    try {

      var ticket = request.query.ticket ;

    //   console.log(ticket);
      
    //   console.log(this._ticketStore);
      // 如果有票据,那就用票据的
      if(this._ticketStore.hasOwnProperty(ticket)){
        // var value =this. _ticketStore[ticket];
        var value =_.cloneDeep(this._ticketStore[ticket]);
        delete this._ticketStore[ticket];
        return value ;
      }  

      return null;
    } catch (err) { 
      this._server.log(['debug', 'security', 'auth', 'ticket'], err);
      return null;
    }
  }

  /**
   * 存储ticket进来
   * @param {Hapi.Request} request HapiJS request instance.
   * @param {Object} value Any object that will be associated with the request.
   * @returns {Promise.<void>}
   */
  set(request, value) {
    assertRequest(request); 

    var ticket = createHash(24);
    if(!this._ticketStore.hasOwnProperty(ticket)){
        this._ticketStore[ticket]=value;
        // console.log(this._ticketStore)
        return ticket;
    }

    this._server.log(['debug', 'security', 'auth', 'ticket'], "have same name ticket");
    return null;
  } 

   
}
