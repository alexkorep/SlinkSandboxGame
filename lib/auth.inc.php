<?
	define('COOKIE_USER_ID', 'userid');

	class CAuth {		public static function RememberUserId($user_id) {			global $g_user_id;			$g_user_id = $user_id;			setcookie(COOKIE_USER_ID, $user_id, time() + 60*60*120); // Will expire in 120 hours
		}
		public static function GetCurrentUserId() {			global $g_user_id;
			if ($g_user_id) {				return $g_user_id;			}			return @$_COOKIE[COOKIE_USER_ID];		}
	}