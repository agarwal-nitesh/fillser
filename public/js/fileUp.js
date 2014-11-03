var selectedDir= "WelcomeIBMUpdate";
window.onload = function(){
  
  

  //Actions taken on loading
  populateDirs();
  addFlds();
  populateFiles(selectedDir);

  //activating directory
  $('Dxdir').click( function(){
    this.class = "active";
  });

  $('.Dxdir').click( function() {
          selectedDir = this.id;
          populateFiles(this.id);
  });

  $('#deleteFile').click(function(){
      var $this =$(this);
      var apiDelete = $this.html();
      var elem = document.getElementById(apiDelete);
      elem.parentNode.removeChild(elem);

      var xhrFordirs = createXHR();
      xhrFordirs.open('POST', '/api/DELETE/'+apiDelete);
      xhrFordirs.send();
  });
};
  
function populateDirs(){
      var xhrFordirs = createXHR();
      xhrFordirs.open('GET', '/api/GET/dirs');
      xhrFordirs.send();
      xhrFordirs.onreadystatechange=function(){
        if(xhrFordirs.readyState===4 && xhrFordirs.status===200){
          var dirs = JSON.parse(xhrFordirs.responseText);
          var dirHolder = document.getElementById('dirHolder');
          dirHolder.innerHTML = "";
          dirs.forEach(function(val, index, arr){
          var addEl = "<li class=\"Dxdir\" id="+val._id.split(" ")[0]+">"+"<a href=\"#\">"+val.dirName+"</li>";
          dirHolder.innerHTML +=addEl;
          });
        $('.Dxdir').click( function() {
          this.class = "active";
          selectedDir = this.id;
          populateFiles(this.id);
        });
      };
    }
  }

function populateFiles(dirId){
      console.log("dir id is " +dirId);
      var xhrFordirs = createXHR();
      xhrFordirs.open('GET', '/api/GET/dirs/'+dirId);
      xhrFordirs.send();
      xhrFordirs.onreadystatechange=function(){
      if(xhrFordirs.readyState===4 && xhrFordirs.status===200){
        var fills = JSON.parse(xhrFordirs.responseText);
        var fillsHolder = document.getElementById("fills");
        fillsHolder.innerHTML="";
        if(fills!=null)
          (fills).forEach(function(val, index, arr){
            if(val!= null){
              var setCId = 'class="fillsUnder" id="'+val._id+'"';
              var addTd = '<td><a href='+val.fileURL+'>'+val._id+'</a></td>';
              var addTr = '<tr '+setCId+'><td></td><td>'+val.fileName+'</td>'+addTd+'</tr>';
              fillsHolder.innerHTML +=addTr;
            }
          });
        $('.fillsUnder').click(function(){
          $('#deleteFile').html(this.id);
        });

      }};
}

function addFlds(){
  $('#plus').click(function(){
    $('#plus').remove();
    $('#addFld').append('<li><a href="#"><input type="text" id="FldName"></input></a></li>');
    $('#addFld').append('<li><a href="#"><button type="button" id="add">add</li>');
    $('#add').click(function(){

      request = $.ajax({
        url:"/api/addFolder",
        type:"post",
        data:$("#FldName").val()});
      var xhrFordirs = createXHR();
      xhrFordirs.open('POST', '/api/addFolder');
      xhrFordirs.send($("#FldName").val());

      xhrFordirs.onreadystatechange=function(){
        if(xhrFordirs.readyState===4 && xhrFordirs.status===200) {
          $("#addFld").html("");
          $('#addFld').append('<li><a href="#" id="plus">+</a></li>');
          populateDirs();
          addFlds();
        }
      };
    });
  });

}

function createXHR() {
    try {
        return new XMLHttpRequest();
      } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
      }
   }