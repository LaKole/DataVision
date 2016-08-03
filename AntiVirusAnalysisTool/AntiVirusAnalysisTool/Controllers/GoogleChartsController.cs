using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace AntiVirusAnalysisTool.Controllers
{
    public class GoogleChartsController : Controller
    {
        static string connString = ConfigurationManager.ConnectionStrings["AnalysisResultContext"].ToString();
        //static string connString = ConfigurationManager.ConnectionStrings["AzureDB"].ToString();

        //return data in google format
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
        
        //use method overloading 
        //get basic data 
        [HttpPost]
        public JsonResult getData(string row, string version, string dateRange, string avList, int detection, string format)
        {
            SqlConnection con = new SqlConnection(connString);

            var sql = "EXEC dbo.getPie @row = '{0}', @version = '{1}', @dateRange = '{2}', @avList = '({3})', @detection = '{4}', @format = '{5}'";

            var statement = string.Format(sql, row, version, dateRange.Replace("'", "''"), avList.Replace("'", "''"), detection, format);

            var cmd = new SqlCommand(statement, con);

            DataTable dt = new DataTable();
            con.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);

            var r = dtToJson(dt);


            con.Close();


            return Json(r, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getData1(string row, string dateRange, string avList, int detection, string format)
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


            return Json(r, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getData2(string column, string row, string dateRange, string avList, int dfc, int dvt)
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


            return Json(r, JsonRequestBehavior.AllowGet);
        }


	}
}