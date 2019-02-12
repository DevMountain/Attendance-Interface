select enrollment.user_id, first_name, last_name,  date_start, date_end, aa.first_ping, aa.last_ping, excused_am, excused_pm, comment, date, classsession.short_name as cohort, location.name as location from enrollment
left join classsession on enrollment.session_id = classsession.id
join "user" on "user".id = enrollment.user_id
join automated_attendance aa on "user".id = aa.user_id
join location on classsession.location_id = location.id
where enrollment.user_id = $1

