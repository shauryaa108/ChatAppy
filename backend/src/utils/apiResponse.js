class ApiResponse{
    constructor(statusCode,message="Everything works fine",data,success){
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.success = success
    }
}
export default ApiResponse