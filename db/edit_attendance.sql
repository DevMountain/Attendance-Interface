update automated_attendance
set first_ping = ${time_in}, last_ping = ${time_out}, comment = ${comment}
where id = ${attendance_id}