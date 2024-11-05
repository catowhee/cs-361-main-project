$(document).ready(function(){

    $('#table-timezones').select2({
        placeholder: "Select time zones",
        allowClear: true
    });
  
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
        const opening = [{
            "start_date": start_date,
            "start_time": start_time,
            "duration": duration,
            "timezone": user_tz
        }];
        openings.push(opening);

        // If timezones are selected, add data for each tz
        if (selected_timezones.length > 1){
            for (let i = 1; i < selected_timezones.length; i++){
                const timezone_data = get_timezone_data(openings[openings.length - 1][0], selected_timezones[i]);
                openings[openings.length - 1].push(timezone_data)
            }
        }
        console.log(openings);
    }

    function add_tz_to_data(timezone){
        for (let i = 0; i < openings.length; i++){
            const timezone_data = get_timezone_data(openings[0][0], timezone);
            openings[i].push(timezone_data);
        }
        console.log(openings)
    }

    function remove_tz_from_data(timezone){
        for (let i = 0; i < openings.length; i++){
            openings[i] = openings[i].filter(opening => opening.timezone !== timezone)
        }
        console.log(openings)
    }

    function add_tz_to_table(tz){

        // Add <tr>
        new_header = `<th class="${tz}">${tz}</th>`
        $("#openings-table thead tr").append(new_header);

        // Add <td> to each body row
        $("#openings-table tbody tr").each(function(index) {
            let opening = openings[index];
            let tz_to_add = opening[opening.length - 1]
            new_td = `<td class="${tz_to_add.timezone}">${get_opening_string(tz_to_add)}</td>`
            $(this).append(new_td);
        });
    }

    function remove_tz_from_table(tz){
        const remove = tz.replace(/\//g, "\\/");
        $(`#openings-table tbody tr td.${remove}`).remove();
        $(`#openings-table thead tr th.${remove}`).remove();
    }

    function get_timezone_data(opening, timezone){
        const DateTime = luxon.DateTime;
        const source_str = `${opening["start_date"]}T${opening["start_time"]}:00`;
        const source_date = DateTime.fromISO(source_str, { zone: user_tz });
        const target_date = source_date.setZone(timezone);
        //const target_date_formatted = target_date.toFormat("yyyy-MM-dd HH:mm:ss");
        return {
            "start_date": `${target_date.toFormat("yyyy-MM-dd")}`,
            "start_time": `${target_date.toFormat("HH:mm")}`,
            "duration": opening["duration"], // duplicated
            "timezone": timezone
        };
    }

    function add_opening_to_table(){
        // Add header if needed
        if ($('#openings-table thead tr').length == 0) {
            console.log("Fresh table");

            // Add tz selector
            $('#timezone-container').append(tz_picker);
            $('#table-timezones').select2();

            let header_row = ""
            for (let i = 0; i < selected_timezones.length; i++) {
                header_row += `<th class="${selected_timezones[i]}">${selected_timezones[i]}</th>`;
            }
            header_row = '<tr><th></th>' + header_row + '</tr>';
            $('#openings-table thead').append(header_row);
        }

        // Add body data
        const opening = openings[openings.length - 1];
        const delete_button = `
            <td class="text-center trash-btn">
                <button class="btn p-0 delete-button">
                    <i class="bi bi-x text-danger" style="font-size: 24px"></i>
                </button>
            </td>
        `;
        let body_row = "";
        for (let i = 0; i < opening.length; i++) {
            body_row += `<td class="${opening[i].timezone}">${get_opening_string(opening[i])}</td>`;
        }
        body_row = "<tr>" + delete_button + body_row  + "</tr>";
        $('#openings-table tbody').append(body_row);
    
    }

    function get_opening_string(opening){

        const DateTime = luxon.DateTime;
        const start_str = `${opening["start_date"]}T${opening["start_time"]}:00`;
        const start = DateTime.fromISO(start_str, { zone: opening.timezone});
        const end = start.plus({minutes: opening.duration});
        
        const start_full_date = start.toFormat("DDD");
        const start_weekday = start.toFormat("ccc");
        const start_month = start.toFormat("LLL");
        const start_day = start.toFormat("d");
        const start_time = start.toFormat("t");

        const end_full_date = end.toFormat("DDD");
        const end_weekday = end.toFormat("ccc");
        const end_month = end.toFormat("LLL");
        const end_day = end.toFormat("d");
        const end_time = end.toFormat("t");

        let opening_string = "";

        if (start_full_date === end_full_date) {
            opening_string = `${start_weekday}, ${start_month} ${start_day}<br>${start_time} - ${end_time}`;
        } else {
            opening_string = `${start_weekday}, ${start_month} ${start_day} at ${start_time}<br>to ${end_weekday}, ${end_month} ${end_day} at ${end_time}`;
        }

        return opening_string;
    };

    function remove_row_from_data(index){
        openings.splice(index, 1);
        console.log(openings)
    }

 
    const user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let openings = [];
    let selected_timezones = [user_tz];
    const form = document.getElementById("add-opening-form");
    const tz_picker = `
        <select id="table-timezones" class="form-control" name="timezones[]" multiple="multiple">
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
        </select>`;
    
    // Add opening upon form submission
    form.addEventListener('submit', function(event){
        event.preventDefault();
        add_opening_to_data();
        add_opening_to_table();
    });

    // Add timezone
    $('#table-timezones').on('select2:select',function(event){
        const added_tz = event.params.data['id'];
        add_tz_to_data(added_tz);
        selected_timezones.push(added_tz);
        add_tz_to_table(added_tz);
        //selected_timezones.splice(0,0,user_tz);
        console.log(selected_timezones);
    });

    // Remove timezone
    $('#table-timezones').on('select2:unselect',function(event){
        const removed_tz = event.params.data['id'];
        remove_tz_from_data(removed_tz);
        const index = selected_timezones.indexOf(removed_tz);
        selected_timezones.splice(index,1);
        console.log(selected_timezones);
        remove_tz_from_table(removed_tz);
    });

    //Remove row
    $('body').on('click', '.delete-button', function(event) {
        const removed_row = $(this).closest('tr');
        const index = removed_row.index();
        removed_row.remove();
        console.log("Index to remove: ", index);
        remove_row_from_data(index);
        if (openings.length === 0) {
            $('#openings-table thead tr').remove();
            $('#table-timezones').remove();
        }
    });

});