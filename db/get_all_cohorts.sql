select location_id, location.short_name as location, classsession.short_name as cohort, date_start from classsession
join location on location.id = classsession.location_id
where date_start >= (select CURRENT_DATE - interval '6 month') and date_start < (select CURRENT_DATE + interval '1 week') and classsession.short_name is not null and classsession.short_name not like '%CANCELLED%'
order by date_start desc