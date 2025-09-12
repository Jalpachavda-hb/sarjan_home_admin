export const BASE_URL = "http://192.168.29.2:8000/api/";

export const API_PATHS = {
  // PENDINGFORAPPROVALS

  DASHBOARD: {
    TODAYRECEIVEDPAYMENT: "todayReceivedPayment",

    DASHBOARDCOUNT: "dashboardCount",
  },

  PENDINGFORAPPROVALSTABLE: {
    PENDINGFORAPPROVALS: "pendingForApprovals", //GET
    APPROVALS: "approval", //POST
    REJECT: "reject", //POST  "description": "id from pendingForApprovals api",
  },

  ADMINAUTH: {
    ADMINLOGIN: "adminLogin", // POST

    GET_PROFILE: "adminProfile", //GET

    UPDATE_PROFIL: "updateProfile", //PUT

    ADMINROLEPERMISSION: "adminRolePermissions", //GET
  },
  //  PROJECT TYPE API

  PROJECTTYPE: {
    GETPROJECTTYPE: "showProjectTypeList", //GET
    EDITPROJECTTYPE: "editProjectType", //POST

    DELETEPROJECTTYPE: "deleteProjectType", //POST
  },

  // PROJECT CATEGORY API

  PROJECTCATEGORY: {
    GETPROJECTCATEGORY: "showProjectCategoryList", //GET

    EDITPROJECTCATEGORY: "editProjectCategory", //POST

    ADDPROJECTCATEGORY: "addProjectCategory", // POST

    DELETPROJECTCATEGORY: "deleteProjectCategory", //POST
  },

  // SITE DETAILS API

  SITEDETAILS: {
    GETSITEDETAILS: "showSiteList", //GET
    ADDSITE: "addSite", //POST
    EDITSITEDETAILS: "editSite", //POST
    DELETESITE: "deleteSite", //POST
    SITEDETAILSBYID: "showSiteDetails", // change url when use
    ADDPROPERTDETAILS: "addPropertyDetails", // POST
    UPLOADBLOCKDETAILCVC: "uploadBlockDetailCsv", //POST
    PROPERTYDETAILSLIST: "propertyDetailsList", // change url when use GET
    GETBLOCKDETAILS: "getBlockDetails", // GET change url when use
    //"description": "propertyDetailsList from this api get block_detail_id"
    EDITPROPERTYDETAILS: "editPropertyDetails", //POST
    //   "description": "id that get in getBlockDetails",
    DELETEPROPERTYDETAILS: "deletePropertyDetails", //POST
  },

  //    ADMIN USER API

  ADMINUSERAPI: {
    SHOWADMINUSER: "showAdminUsers", //GET
    ADDADMINUSER: "addAdminUser", // POST
    DELETEADMINUSER: "deleteAdminUser", // POST
    GETADMINUSER: "getAdminUser", //GET
    UPDATEADMINUSER: "updateAdminUser", //POST
  },

  //   CLIENT DETAILS
  CLIENTDATA: {
    GETCLIENTECOUNTOFSITE: "getClientCountofSite", //GET
    SHOWCLIENTLIST: "showClientList", // GET
    ADDCLIENT: "addClient", //POST
    EDITCLIENT: "editClient", //GET //perrow =  "raw": "{{url}}editClient?admin_id=1&client_milestone_id=22",
    UPDATECLIENTDATA: "updateClientData", //POST
    DELETECLIENTDAT: "deleteClient", // POST
    GETCLIENTPAYMENT: "getClientPayments", // GET {{url}}getClientPayments?client_id=Ev&site_id=3&block_id=196
    ADDPAYMENTFROMCLIENT: "addPaymentFromClient", // CHECK POSTMAN COLLECTION FILE FOR SHOW ID AND GET ID FROM
  },

  //  DOCUMENT API

  COMMONDOCUMENTS: {
    ADDCOMMUNDOCUMENT: "addCommonDocuments", //POST
    SHOWCOMMUNDOCUMENT: "showCommonDocuments", // "raw": "{{url}}showCommonDocuments?admin_id=13",
    DELETECOMMONDOCUMENTS: "deleteCommonDocuments",
  },
  PERSONALDOCUMENT: {
    GETPERSONALDOCUMENT: "showPersonalDocuments", //GET
    ADDPERSONALDOCUMENT: "addPersonalDocuments", //POST
    DELETEPersonalDocuments: "deletePersonalDocuments",
  },

  // REPORT
  SITEREPORT: {
    SHOWSITEREPORT: "showSiteReports", //              "raw": "{{url}}showSiteReports?admin_id=1&site_id=",
    //              "raw": "{{url}}getClientReportSummary?siteFilter=1",
  },
  CLIENTREPORT: {
    VIEWLEDGER: " viewLedger", //"raw": "{{url}}viewLedger?clientid&block_detail_id",
    SHOWCLIENTREPORT: "showClientReports", //raw": "{{url}}getClientReportSummary?siteFilter=1",
    SHOWCLIENTREPORTSUMMERY: "getClientReportSummary",
  },

  // PAYMENT
  PAYMENT: {
    SHOWPAYMENTDETAILS: "showPaymentDetails", //GET "raw": "{{url}}showPaymentDetails?admin_id&searchByDays&startDate&endDate",
    GETBLOCKDETAILSFROMSITE: "getBlockDetailsFromSite_Id", // "raw": "{{url}}getBlockDetailsFromSite_Id?site_id=1",
    DESTROYPAYMENTRECEIPT: "destroyPaymentReceipt", //POST
    DESTROYPAYMENTDETAILS: "destroyPaymentDetails", //POST
    EDITPAYMENTFROMADMIN: "editPaymentFromAdmin", //POST
  },

  // TICKET

  TICKET: {
    SHOWADMINTICKET: "showAdminTicket", // GET    "raw": "{{url}}showAdminTicket?admin_id=1",
    //  "query": [
    //             {
    //               "key": "admin_id",
    //               "value": "1",
    //               "description": "login time admin id"
    //             },
    //             {
    //               "key": "requestSiteFilter",
    //               "value": "3",
    //               "description": "use this api \"showdecodeSiteList\"",
    //               "disabled": true
    //             }
    //           ]
    SHOWCLIENTTICKET: "showClientTicket", //"raw": "{{url}}showClientTicket?admin_id=1",
    ADDADMINTICKET: "addAdminTicket", //POST
    SHOWTICKETGISTORY: "showTicketHistory",
    GETTICKETMESSAGES: "getTicketMessages", //    "raw": "{{url}}getTicketMessages?admin_id=1&ticket_id=14",
    REPLAYTOTICKET: "replyToTicket", //POST
    CLOSETICKET: "  closeTicket", //POST
  },

  // USERLOG API
  USERLOG: {
    GETUSERADMINLOG: "getAdminUserLogs", //"raw": "{{url}}getAdminUserLogs?page=2",
  },

  // WEBSETTING

  WEBSETTING: {
    GETWEBSETTING: "getWebSetting",
    UPDATEWEBSETTING: "updateWebSetting",
  },
  APPSETTING: {
    GETSPLASHSCREEN: "showsplashscreen", // showsplashscreen?admin_id=1" ,
    DELETESPLASHSCREEN: "deletesplashscreen", //"raw": "{{url}}deletesplashscreen?admin_id=1&id=41",
    INSERTSPLASHSCREEN: "insertsplashscreen", //GET
  },
  SITEINQUIRY: {
    SHOWSITEINQUIRY: "showSiteInquiry",
    INQUIRYTHROUGH: "inquiry_through",
  },

  MULTITIMEUSEAPI: {
    GETBLOCKDETAILSFROMSITE_ID: "getBlockDetailsFromSite_Id", //          "raw": "{{url}}getBlockDetailsFromSite_Id?site_id=1",
    SHOWCODESITELIST: "showdecodeSiteList", //  "raw": "{{url}}showdecodeSiteList?site_id",
    GETBLOCKFROMSITEID: " getBlockFromSiteId", //"raw": "{{url}}getBlockFromSiteId?site_id=jR",
    GETBLOCKNUMBERFROMBLOCK: "getBlockNumberFromBlock", //"raw": "{{url}}getBlockNumberFromBlock?block_id=k5",
    GETADMINUSERROLE: "getAdminUserRoles", //"raw": "{{url}}getAdminUserRoles?admin_id=1",  this Api work for other admin login show delete permission
    GETBLOCKFROMDECODESITEID: "getBlockFromDecodeSiteId",
    GETCLIENTNAMEFROMBLOCKID: "getClientNameFromBlockId",
    UNITTYPE: "unitType",
    GETCLIENTNAMEFROMSITEID: "getClientNameFromSiteId",
  },
};
