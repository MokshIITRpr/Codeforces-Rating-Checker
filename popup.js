document.getElementById('Add').onclick = function () {
    var username = document.getElementById('username').value;
    if (!username) {
        alert('No Username Entered');
    }
    else {
        chrome.storage.sync.set({ 'username': username }, function () {
            chrome.storage.local.get({ userIds: [] }, function (Ids) {
                document.getElementById('username').value = "";
                var userIds = Ids.userIds;
                var flag = 0;
                for (i = 0; i < userIds.length; i++) {
                    if (userIds[i].user == username) {
                        flag = 1;
                        alert('Username Already Exists');
                        break;
                    }
                }
                if (flag == 0) {
                    userIds.push({ 'user': username });
                    alert(username + ' added !');
                }
                chrome.storage.local.set({ userIds: userIds }, function () {

                });
            });
        });
    };
};

document.getElementById('Ratings').onclick = function() {
    chrome.storage.local.get({userIds: []}, function(Ids) {
        var userIds = Ids.userIds;
        var str = "<div class='heading_table'>Friends Ratings :</div><br><table id = 'customers'><tr><th>Username</th><th >Ratings</th></tr>";
        var str_new = str;
        var temp=0;
            var api = "https://codeforces.com/api/user.info?handles=";
            // Build semicolon-separated handles without a leading semicolon
            var handles = [];
            for (var i = 0; i < userIds.length; i++) {
                handles.push(encodeURIComponent(userIds[i].user));
            }
            api += handles.join(";");
        if(userIds.length==0)
			document.getElementById("rating_table").innerHTML = "No Data Entered :(";
		else{
            $.get(api, function(data) {
                if (!data || data.status !== "OK" || !Array.isArray(data.result)) {
                    document.getElementById('rating_table').innerHTML = "Failed to fetch ratings.";
                    return;
                }
                for (var i = 0; i < data.result.length; i++) {
                    var handle = data.result[i].handle;
                    var rating = data.result[i].rating !== undefined ? data.result[i].rating : "N/A";
                    str += "<tr><td><a href='https://codeforces.com/profile/" + encodeURIComponent(handle) + "' target='_blank'>" + handle + "</a>" + "<td>" + rating + "</tr>";
                }
                str = str + "</table>";
                document.getElementById('rating_table').innerHTML = str;
            }).fail(function() {
                document.getElementById('rating_table').innerHTML = "Failed to fetch ratings.";
            });
		}
    });
};

document.getElementById('Delete').onclick = function() {
    if(confirm("This will delete all users from the friends list!!"))
    {
        var arr = new Array();
        chrome.storage.local.set({userIds: arr}, function() {
            alert('All Friends Removed!');
        });
    }
}

document.getElementById("Contests").onclick = function() {
    var con_api = "https://codeforces.com/api/contest.list";
	var str_contest= "<div class='heading_table'>Future Contests:</div> <br/><table id = 'customers' border = 0> <tr> <th>Contest</th> <th>Start Time</th> </tr>";
	$.get(con_api,function(data){
        // show up to 10 upcoming contests
        if (!data || data.status !== "OK" || !Array.isArray(data.result)) {
            document.getElementById("Contest_table").innerHTML = "Failed to fetch contests.";
            return;
        }
        var count = 0;
        for (var i = 0; i < data.result.length && count < 10; i++) {
            var contest = data.result[i];
            if (contest.phase === "BEFORE") {
                var myDate = new Date(contest.startTimeSeconds * 1000);
                str_contest += "<tr><td>" + contest.name + "</td>" + "<td>" + myDate + "</td></tr>";
                count++;
            }
        }
		str_contest=str_contest+"</table>"
		document.getElementById("Contest_table").innerHTML = str_contest;
	});
}
//MokshIITRpr