$(document).ready(function(){

    console.log("hello");

    $('.js-example-basic-multiple').select2();
  

    // Initialize Flatpickr for date picker (date only)
    flatpickr("#start-date", {
        enableTime: false,       
        altFormat: "l, F j",       
        altInput: true,
        dateFormat: "Y-m-d"
        //defaultDate: "Thursday, November 11"
    });
    
    // Initialize Flatpickr for time picker (time only)
    flatpickr("#start-time", {
        enableTime: true,
        altFormat: "h:i K",
        altInput: true,     
        noCalendar: true,     
        dateFormat: "H:i",      
        time_24hr: false        
    });
      
    function add_opening_to_data(){
        const start_date =  document.getElementById('start-date').value;
        const start_time =  document.getElementById('start-time').value;
        const duration =  document.getElementById('duration').value;
        const opening = {
            "start_date": start_date,
            "start_time": start_time,
            "duration": duration,
            "timezone": user_tz
        }
        openings.push(opening)
        console.log(openings);
    }
    
    function add_opening_to_table(){
        const opening_table =  document.getElementById('openings-table');
        // If table doesn't have data yet, we'll have additional steps
        const empty_table = opening_table.querySelector('thead tr') == null;
        if (empty_table) {
            console.log("Fresh table");
            const header_row = `<tr><th>${user_tz}</th></tr>`;
            $('#openings-table thead').append(header_row);
        }

        const new_opening_string = get_opening_string(openings[openings.length - 1]);
        const body_row = `<tr><td>${new_opening_string}</td></tr>`;
        $('#openings-table tbody').append(body_row);
        //console.log(new_opening_row);
    
    }

    function get_opening_string(opening){

        const start = new Date(opening["start_date"] + "T" + opening["start_time"] + ":00");
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + Number(opening["duration"]))

        // Date formatting
        const format_options = {
            timeZone: opening["timezone"],
            weekday: 'long',
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            hourCycle: "h23",
            //dayPeriod: 'narrow',
            minute: 'numeric'
        }
        const formatter = new Intl.DateTimeFormat('en-US', format_options);

        // Start parts!
        const start_parts = formatter.formatToParts(start);
        console.log(start_parts);
        const start_weekday = start_parts.find(part => part.type === 'weekday').value;
        const start_month = start_parts.find(part => part.type === 'month').value;
        const start_day = start_parts.find(part => part.type === 'day').value;
        const start_year = start_parts.find(part => part.type === 'year').value;

        let start_hour = start_parts.find(part => part.type === 'hour').value;
        const start_am_pm =  start_hour >= 12 ? 'PM' : 'AM';
        start_hour = start_hour % 12 || 12;

        const start_minute = start_parts.find(part => part.type === 'minute').value;

        // End parts!
        const end_parts = formatter.formatToParts(end);
        const end_weekday = end_parts.find(part => part.type === 'weekday').value;
        const end_month = end_parts.find(part => part.type === 'month').value;
        const end_day = end_parts.find(part => part.type === 'day').value;
        const end_year = end_parts.find(part => part.type === 'year').value;

        let end_hour = end_parts.find(part => part.type === 'hour').value;
        const end_am_pm =  end_hour >= 12 ? 'PM' : 'AM';
        end_hour = end_hour % 12 || 12;

        const end_minute = end_parts.find(part => part.type === 'minute').value;


        let opening_string = "";
        const same_date = start_month === end_month && start_day === end_day && start_year === end_year;
        if (same_date){
            opening_string = `${start_weekday}, ${start_month}/${start_day}<br>${start_hour}:${start_minute} ${start_am_pm} - ${end_hour}:${end_minute} ${end_am_pm}`;
        }
        return opening_string;

    };
    
    const user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const openings = []
    const form = document.getElementById("add-opening-form");
    
    // Add opening to openings array when form is submitted
    form.addEventListener('submit', function(event){
        event.preventDefault();
        add_opening_to_data();
        add_opening_to_table();
    });
});