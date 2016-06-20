using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Woju.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        //public ActionResult Upload(string submissionName, HttpPostedFileBase file)
        //{
        //    //create submission directory
        //    string fileDirectory = Server.MapPath("~/UploadedCSV/");
        //    string submissionDirectory = fileDirectory + submissionName;
        //    System.IO.Directory.CreateDirectory(submissionDirectory);
            
        //    //save submission to submission directory
        //    string filePath = submissionDirectory + "/" + file.FileName;
        //    file.SaveAs(filePath);

        //    //save schema to submission directory - currently copies predefined, future add code to generate schema
        //    System.IO.File.Copy(fileDirectory + "/schema.ini", submissionDirectory + "/schema.ini", true);
            
        //    //import to DB using schema 


        //    ViewBag.Path = submissionDirectory;
        //    return View();
        //}


    }
}