using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace Woju.Controllers
{
    public class UploadController : Controller
    {
        // GET: Upload
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Upload(string submissionName, HttpPostedFileBase file)
        {
            //create submission directory
            string fileDirectory = Server.MapPath("~/UploadedCSV/");
            string submissionDirectory = fileDirectory + submissionName;
            System.IO.Directory.CreateDirectory(submissionDirectory);

            //save submission to submission directory
            string filePath = submissionDirectory + "/" + file.FileName;
            file.SaveAs(filePath);

            //save schema to submission directory - currently copies predefined, future add code to generate schema
            System.IO.File.Copy(fileDirectory + "schema.ini", submissionDirectory + "/schema.ini", true);

            //import to DB using schema 
            string localPath = submissionName + "/" + file.FileName;

            ViewBag.Import = ImportCsv(filePath, submissionName);

            return View();
        }

        private static string ImportCsv(string filePath, string submissionName)
        {
            try
            {

                string query = @"SELECT * INTO {0} 
                                FROM OPENQUERY(UploadedCSV, 'select * from {1}')";

                query = String.Format(query, submissionName, filePath);

                Configuration rootWebConfig = WebConfigurationManager.OpenWebConfiguration("/MyWebSiteRoot");
                System.Configuration.ConnectionStringSettings connString;
                if (rootWebConfig.ConnectionStrings.ConnectionStrings.Count > 0)
                {
                    connString = rootWebConfig.ConnectionStrings.ConnectionStrings["WojuDB"];
                    if (connString != null)
                    {
                        SqlConnection conn = new SqlConnection(connString.ConnectionString);
                        SqlCommand cmd = new SqlCommand();
                        
                        cmd.CommandText = query;
                        cmd.Connection = conn;
                        cmd.CommandType = CommandType.Text;
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }


                }
                else { return "No connection string"; }



                //using (SqlConnection con = new SqlConnection())
                //{
                //    con.ConnectionString = connString.ConnectionString;
                //    con.Open();
                //    using (SqlCommand cmd = new SqlCommand())
                //    {
                //        cmd.Connection = con;
                //        cmd.CommandText = query;
                //        cmd.ExecuteNonQuery();
                //    }
                //    con.Close();
                //}
                return "success";

                //return "conn string count > 0";
            }
            catch (Exception ex)
            {
                string message = String.Format("CSV file import failed. Inner Exception: {0}", ex.Message);
                return message;
                //throw new ImportFailedException(message);
            }
        }
    }
}