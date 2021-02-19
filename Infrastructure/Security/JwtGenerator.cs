using System.Collections.Generic;
using System.Security.Claims;
using Application.Interfaces;
using Domain;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        public string CreateToken(AppUser user)
        {
           // Build Token ==> which contain list of claims 
           var claims=new List<Claim>{
               new Claim(JwtRegisteredClaimNames.NameId,user.UserName)
           };

           // Generate Siging credentials
           var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes("EmanLovesMoeKey12345"));
           // Creating credential for signing the Token to be verified from the server
           var credentials= new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);
           // Prepare the descriptor 
           var tokenDescriptor= new SecurityTokenDescriptor
           {
               Subject=new ClaimsIdentity(claims),
               Expires=DateTime.Now.AddDays(7),
               SigningCredentials=credentials
           };

           // Generate token handler
           var tokenHanlder= new JwtSecurityTokenHandler();
           var token=tokenHanlder.CreateToken(tokenDescriptor);

           return tokenHanlder.WriteToken(token);
        }
    }
}