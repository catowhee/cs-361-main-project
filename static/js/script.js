console.log("hello");

// Initialize Flatpickr for date picker (date only)
flatpickr("#date", {
    enableTime: false,        // Date only, no time
    dateFormat: "l, F n",       // Format as YYYY-MM-DD
    defaultDate: "Thursday, November 11"
});

// Initialize Flatpickr for time picker (time only)
flatpickr("#time", {
    enableTime: true,         // Time only
    noCalendar: true,         // No calendar, just time picker
    dateFormat: "H:i",        // Format as HH:MM
    time_24hr: true           // Use 24-hour format
});

const user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const openings = []
const form = document.getElementById("add-opening-form");

// Add opening to openings array when form is submitted
form.addEventListener('submit', function(event){
    event.preventDefault();
    // Get the values from the form
    const start_date =  document.getElementById('date').value;
    const start_time =  document.getElementById('time').value;
    const duration =  document.getElementById('duration').value;
    const opening = {
        "start_date": start_date,
        "start_time": time,
        "duration": duration,
        "timezone": user_tz
    }
    console.log(opening);
});



