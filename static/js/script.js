console.log("hello");

// Initialize Flatpickr for date picker (date only)
flatpickr("#start-date", {
    enableTime: false,        // Date only, no time
    dateFormat: "l, F n",       // Format as YYYY-MM-DD
    defaultDate: "Thursday, November 11"
});

// Initialize Flatpickr for time picker (time only)
flatpickr("#start-time", {
    enableTime: true,         // Time only
    noCalendar: true,         // No calendar, just time picker
    dateFormat: "H:i",        // Format as HH:MM
    time_24hr: true           // Use 24-hour format
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
    const fresh_table = opening_table.querySelector('thead tr') == null;
    console.log("Fresh table");

}

const user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const openings = []
const form = document.getElementById("add-opening-form");

// Add opening to openings array when form is submitted
form.addEventListener('submit', function(event){
    event.preventDefault();
    add_opening_to_data();
    add_opening_to_table();
});



