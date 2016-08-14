using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace AntivirusAnalytics.Models
{
    public class User
    {
        [Key]
        public string Email { get; set; }

        public string Password { get; set; }

        public bool RememberMe { get; set; }

        //model logic
        AntivirusAnalyticsDB db = new AntivirusAnalyticsDB();

        public bool Validate(User user)
        {
            try
            {
                var tUser = db.Users.Where(u => u.Email.Equals(user.Email) && u.Password == user.Password).FirstOrDefault();
                
                if (tUser != null)
                {
                    tUser.RememberMe = user.RememberMe;
                    db.SaveChanges();
                    return true;
                }
                else { return false; }
            }
            catch { throw; }

        }

        public bool Register(User user)
        {
            try
            {
                //check exists
                var tUser = db.Users.Where(u => u.Email.Equals(user.Email)).FirstOrDefault();

                if (tUser == null)
                {
                    user.RememberMe = true;
                    db.Users.Add(user);
                    db.SaveChanges();
                    return true;
                }
                else { return false; }
            }
            catch { throw; }

        }



        //not using model logic
        public bool IsValid(string email, string password)
        {
            string connString = ConfigurationManager.ConnectionStrings["AnalysisResultContext"].ToString();
            SqlConnection con = new SqlConnection(connString);

            var sql = @"SELECT [Email] FROM [dbo].[Users] WHERE [Email] = @email AND [Password] = @password";
            var cmd = new SqlCommand(sql, con);
            cmd.Parameters
                     .Add(new SqlParameter("@email", SqlDbType.NVarChar))
                     .Value = email;
            cmd.Parameters
                .Add(new SqlParameter("@password", SqlDbType.NVarChar))
                .Value = password;
            con.Open();
            var reader = cmd.ExecuteReader();
            if (reader.HasRows)
            {
                reader.Dispose();
                cmd.Dispose();
                return true;
            }
            else
            {
                reader.Dispose();
                cmd.Dispose();
                return false;

            }

        }

    }



}