using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public HttpStatusCode Code { get; set; }
        public object Error { get; set; }
        public RestException(HttpStatusCode code, object error = null)
        {
            this.Error = error;
            this.Code = code;

        }
    }
}