//Allows the user to search through the the employee table for names
function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  //input for search
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  //employee table
  table = document.getElementById("empTable");
  tr = table.getElementsByTagName("tr");
  //for every 'td' display if the inputted seach matches the value
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1]; //'1' is the second row of the table 'Full Name'
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}