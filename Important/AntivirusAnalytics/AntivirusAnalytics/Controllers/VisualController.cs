using AntivirusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Security;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Microsoft.AspNet.Identity;

namespace AntivirusAnalytics.Controllers
{
    public class VisualController : Controller
    {
        //model logic
        AntivirusAnalyticsDB db = new AntivirusAnalyticsDB();
        //local db connection
        //static string connString = ConfigurationManager.ConnectionStrings["AVLocalContext"].ToString();
        //azure db connection
        static string connString = ConfigurationManager.ConnectionStrings["AzureDB"].ToString();

        public ActionResult Index()
        {
            return View();
        }

        public void SaveHistory(string query)
        {
            if (User.Identity.IsAuthenticated)
            {
                Models.User n = new Models.User();
                n.ID = n.GetUserId(User.Identity.Name);
                History h = new History();
                h.UserID = Convert.ToInt32(n.ID);
                h.Query = query;
                h.CreateDate = DateTime.Now;

                History.SaveHistory(h);
            }
        }

        //fix for method overloading 
        //get basic data 
        [HttpPost]
        public JsonResult GetData(string key, string version, string dateRange, string avList, int detection, string format)
        {
            SqlConnection con = new SqlConnection(connString);

            var sql = "EXEC dbo.getPie @row = '{0}', @version = '{1}', @dateRange = '{2}', @avList = '({3})', @detection = '{4}', @format = '{5}'";

            var statement = string.Format(sql, key, version, dateRange.Replace("'", "''"), avList.Replace("'", "''"), detection, format);

            var cmd = new SqlCommand(statement, con);

            DataTable dt = new DataTable();
            con.Open();
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            var r = dtToJson(dt);
            con.Close();

            SaveHistory(statement);

            return Json(r, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GtData1(string row, string dateRange, string avList, int detection, string format)
        {
            SqlConnection con = new SqlConnection(connString);

            var sql = "EXEC dbo.getVersionComparison @row = '{0}', @dateRange = '{1}', @avList = '({2})', @detection = '{3}', @format = '{4}'";

            var statement = string.Format(sql, row, dateRange.Replace("'", "''"), avList.Replace("'", "''"), detection, format);

            var cmd = new SqlCommand(statement, con);

            DataTable dt = new DataTable();
            con.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);

            var r = dtToJson(dt);


            con.Close();

            SaveHistory(statement);

            return Json(r, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetData2(string column, string row, string dateRange, string avList, int dfc, int dvt)
        {
            SqlConnection con = new SqlConnection(connString);


            var sql = "EXEC dbo.getMatrix @column = '{0}', @row = '{1}', @dateRange = '{2}', @avList = '({3})', @detCondFC = '{4}', @detCondVT = '{5}'";

            var statement = string.Format(sql, column, row, dateRange.Replace("'", "''"), avList.Replace("'", "''"), dfc, dvt);

            var cmd = new SqlCommand(statement, con);

            DataTable dt = new DataTable();
            con.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);

            var r = dtToJson(dt);


            con.Close();

            SaveHistory(statement);

            return Json(r, JsonRequestBehavior.AllowGet);
        }



        //return data in google format, sampled - http://stackoverflow.com/questions/17398019/how-to-convert-datatable-to-json-in-c-sharp
        public string dtToJson(DataTable dt)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<Dictionary<string, List<Dictionary<string, object>>>> rows = new List<Dictionary<string, List<Dictionary<string, object>>>>();
            Dictionary<string, List<Dictionary<string, object>>> row;
            List<Dictionary<string, object>> rowData;
            Dictionary<string, object> data;
            foreach (DataRow dr in dt.Rows)
            {
                row = new Dictionary<string, List<Dictionary<string, object>>>();
                rowData = new List<Dictionary<string, object>>();
                foreach (DataColumn col in dt.Columns)
                {
                    data = new Dictionary<string, object>();
                    if (col.ColumnName.ToLower() == "scandate")
                    {
                        DateTime d = DateTime.Parse(dr[col].ToString());
                        string sd = "Date(" + d.Year + ", " + (d.Month - 1) + ", " + d.Day + ")";
                        data.Add("v", sd);
                    }
                    else
                    {
                        data.Add("v", dr[col]);
                    }
                    rowData.Add(data);

                }
                row.Add("c", rowData);
                rows.Add(row);
            }

            List<Dictionary<string, string>> columns = new List<Dictionary<string, string>>();
            Dictionary<string, string> column;

            foreach (DataColumn colu in dt.Columns)
            {
                column = new Dictionary<string, string>();
                if (colu.ColumnName.ToLower() == "scandate")
                {
                    column.Add("id", colu.ColumnName);
                    column.Add("label", colu.ColumnName);
                    column.Add("type", "date");
                }
                else if (colu.ColumnName.ToLower() == "antivirus" || colu.ColumnName.ToLower() == "md5")
                {
                    column.Add("id", colu.ColumnName);
                    column.Add("label", colu.ColumnName);
                    column.Add("type", "string");
                }
                else
                {
                    column.Add("id", colu.ColumnName);
                    column.Add("label", colu.ColumnName);
                    column.Add("type", "number");
                }

                columns.Add(column);
            }

            var r = "{\"cols\": " + serializer.Serialize(columns) + ", \"rows\": " + serializer.Serialize(rows) + "}";

            return r;
        }

    }

}
