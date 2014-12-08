<?php
	require_once('config.inc.php');
	mysql_connect($db_host, $db_username, $db_password);
	mysql_select_db($db_database);

	mysql_query("SET NAMES 'utf8'");
	mysql_query("SET CHARACTER SET 'utf8'");

   $g_queryCount = 0; ///< number of queries executed during page preparing

   /// @brief Increments number of queries executed during page preparing
   function db_inc_query_count()
   {
      global $g_queryCount;
      ++$g_queryCount;
   }

   /// @brief Get number of queries executed during page preparing
   function db_get_query_count()
   {
      global $g_queryCount;
      return $g_queryCount;
   }

   /// @brief returns database table prefix
   /// @return database table prefix
   function db_table_prefix()
   {
      global $db_table_prefix;
      return $db_table_prefix;
   }

   /// @brief Loads result of sql execution to the array
   /// @return Associative array with rows.
   function db_load_array($sql)
   {
      db_inc_query_count();

      $result = mysql_query($sql) or die($sql);
      $rows = array();
      while ($row = mysql_fetch_array($result))
      {
         $rows[] = $row;
      }
      mysql_free_result($result);
      return $rows;
   }

   /// @brief Loads result of sql execution to the array in reversed
   ///        order (last rows from SQL result go to the beginning of array)
   /// @return Associative array with rows.
   function db_load_array_reversed($sql)
   {
      db_inc_query_count();

      $result = mysql_query($sql);
      $rows = array();
      while ($row = mysql_fetch_array($result))
      {
         array_unshift($rows, $row);
      }
      mysql_free_result($result);
      return @$rows;
   }

   /// @brief Loads first row of result of sql execution to the array
   /// @return Associative array with fields.
   function db_load_row($sql)
   {
      db_inc_query_count();

      $result = mysql_query($sql);
      $row = mysql_fetch_array($result);
      mysql_free_result($result);
      return $row;
   }


   /// @brief Loads result of sql execution to the int value
   /// @return int value.
   function db_load_int($sql)
   {
      db_inc_query_count();

      $result = mysql_query($sql) or die($sql);
      $row = mysql_fetch_array($result);
      mysql_free_result($result);
      return intval($row[0]);
   }

   /// @param Executes SQL expression (like inserting, deleting)
   /// @return New record id if a record has been added
   function db_execute($sql)
   {
      db_inc_query_count();

      mysql_query($sql);
      return mysql_insert_id();
   }
?>