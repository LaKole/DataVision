using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace AntiVirusAnalysisTool.Controllers
{
    public class AnalysisController : Controller
    {

        //static string connString = ConfigurationManager.ConnectionStrings["AnalysisResultContext"].ToString();
        static string connString = ConfigurationManager.ConnectionStrings["AzureDB"].ToString();


        [HttpPost]
        public JsonResult buildQuery2(string measure, string attribute1, string attribute2, string d, string v)
        {
            string query, mCond;

            if (attribute1 == "version")
            {
                query = "SELECT " + attribute2 + ", SUM(CASE WHEN DetectionFailureAVR = " + d + " THEN 1 ELSE 0 END) [Full Capability], SUM(CASE WHEN DetectionFailureMalware = " + d + " THEN 1 ELSE 0 END) VirusTotal FROM dbo.AnalysisResults GROUP BY " + attribute2 + " ORDER BY " + attribute2;

                return returnQueryData(query);

            }
            switch (measure)
            {
                case "md5":
                    if (attribute1 == "version")
                    {
                        mCond = "SUM(CASE WHEN DetectionFailureAVR = " + d + " then 1 end) FullCapability, SUM(CASE WHEN DetectionFailureMalware = " + d + " then 1 end) VirusTotal";
                    }
                    else { mCond = "SUM(CASE WHEN DetectionFailure" + v + " = " + d + " then 1 end) DFcount"; }

                    break;
                default:
                    mCond = "COUNT(DISTINCT " + measure + ") " + measure + "Count";
                    break;
            }

            if (attribute2 == "")
            {
                //build query for 2 dimensional data
                query = "SELECT " + attribute1 + ",  " + mCond + " FROM dbo.AnalysisResults GROUP BY " + attribute1 + " ORDER BY " + attribute1;
            }
            else
            {
                //build query to return matrix data
                query = "EXEC dbo.getMatrix '" + attribute1 + "', '" + attribute2 + "', '" + measure ;
            }

            return returnQueryData(query);

        }



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





        [HttpPost]
        public JsonResult buildQuery(string measure, string attribute1, string attribute2, string d, string v, string avl, string dl)
        {
            string query, mCond, filterOpt, detOpt;

            
            filterOpt = "WHERE Antivirus IN (" + avl + ")";
            detOpt = " AND DetectionFailure" + v + " = " + d;

            if (attribute1 == "version")
            {
                query = "SELECT " + attribute2 + ", SUM(CASE WHEN DetectionFailureAVR = " + d + " THEN 1 ELSE 0 END) [Full Capability], SUM(CASE WHEN DetectionFailureMalware = " + d + " THEN 1 ELSE 0 END) VirusTotal FROM dbo.AnalysisResults " + filterOpt + " GROUP BY " + attribute2 + " ORDER BY " + attribute2;

                return returnQueryData(query);

            }
            switch (measure)
            {
                case "md5":
                    if (attribute1 == "version"){
                        mCond = "SUM(CASE WHEN DetectionFailureAVR = " + d + " then 1 end) FullCapability, SUM(CASE WHEN DetectionFailureMalware = " + d + " then 1 end) VirusTotal";
                    }
                    else { mCond = "SUM(CASE WHEN DetectionFailure" + v + " = " + d + " then 1 end) DFcount"; }

                    break;
                default:
                    mCond = "COUNT(DISTINCT " + measure + ") " + measure + "Count";
                    break;
            }

            if (attribute2 == "")
            {
                //build query for 2 dimensional data
                query = "SELECT " + attribute1 + ",  " + mCond + " FROM dbo.AnalysisResults " + filterOpt + " GROUP BY " + attribute1 + " ORDER BY " + attribute1;
            }
            else
            {
                //build query to return matrix data
                query = "EXEC dbo.getMatrix '" + attribute1 + "', '" + attribute2 + "', '" + measure + "', '" + filterOpt.Replace("'", "''") + ""+detOpt+"'"; ;
            }

            return returnQueryData(query);

        }

        public JsonResult returnQueryData(string query)
        {

            SqlConnection conn = new SqlConnection(connString);

            var cmd = new SqlCommand(query, conn);

            DataTable dt = new DataTable();
            conn.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);

            var r = dtToJson(dt);
            conn.Close();

            return Json(r, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public ActionResult getData(string key, string xaxis, string measure, int d, string v)
        {

            SqlConnection con = new SqlConnection(connString);

            string cond, sql;

            cond = "WHERE DetectionFailure" + v + " = " + d.ToString();

            switch (key)
            {
                case "version":
                    sql = "SELECT " + xaxis + ", sum(DetectionFailureAVR) [Full Capability], sum(DetectionFailureMalware) [Virus Total] FROM dbo.AnalysisResults GROUP BY " + xaxis + " ORDER BY " + xaxis;
                    break;
                default:
                    sql = "EXEC dbo.getMatrix '" + key + "', '" + xaxis + "', '" + measure + "', '" + cond + "'";
                    break;
            }


            var cmd = new SqlCommand(sql, con);

            DataTable dt = new DataTable();
            con.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);

            var r = dtToJson(dt);


            con.Close();


            return Json(r, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult getPieData(string key, string slice, int d, string v)
        {

            SqlConnection con = new SqlConnection(connString);

            string cond, sql;

            cond = "WHERE DetectionFailure" + v + " = " + d.ToString();

            sql = "select " + key + ", COUNT(distinct " + slice + ") from dbo.AnalysisResults " + cond + " GROUP BY " + key;


            var cmd = new SqlCommand(sql, con);

            DataTable dt = new DataTable();
            con.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);

            var r = dtToJson(dt);


            con.Close();


            return Json(r, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult getTableData(string column, string row, string groupby, int d, string v)
        {

            SqlConnection con = new SqlConnection(connString);

            string cond;

            cond = "WHERE DetectionFailure" + v + " = " + d.ToString();

            string sql = "EXEC dbo.getMatrix '" + column + "', '" + row + "', '" + groupby + "', '" + cond + "'";

            var cmd = new SqlCommand(sql, con);

            DataTable dt = new DataTable();
            con.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);

            var r = dtToJson(dt);


            con.Close();


            return Json(r, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public ActionResult getTableData2(string column, string row, string groupby, int d, string v)
        {

            SqlConnection con = new SqlConnection(connString);

            string cond;

            cond = "WHERE DetectionFailure" + v + " = " + d.ToString();

            string sql = "EXEC dbo.getMatrix '" + column + "', '" + row + "', '" + groupby + "', '" + cond + "'";

            var cmd = new SqlCommand(sql, con);

            DataTable dt = new DataTable();
            con.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);



            con.Close();


            return Json(dt, JsonRequestBehavior.AllowGet);

        }





    }
}