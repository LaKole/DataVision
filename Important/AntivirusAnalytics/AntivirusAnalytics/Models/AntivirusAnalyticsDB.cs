using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace AntivirusAnalytics.Models
{
    public class AntivirusAnalyticsDB : DbContext
    {

        public AntivirusAnalyticsDB()
            : base("name=AzureDB")
            //: base("name=AVLocalContext")
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<History> HistoryRepository { get; set; }
    }
}