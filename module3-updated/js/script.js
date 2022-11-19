//want to do straight forward JS but can't because we need to use JQuery library

$(function () { // $ = Same as document.addEventListener("DOMContentLoaded"...

    // $ = Same as document.querySelector("#navbarToggle").addEventListener("blur",...
    $("#navbarToggle").blur(function (event) {
      var screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        $("#collapsable-nav").collapse('hide'); //when lose focus -> collapse
      }
    });
  
    // In Firefox and Safari, the click event doesn't retain the focus
    // on the clicked button. Therefore, the blur event will not fire on
    // user clicking somewhere else in the page and the blur event handler
    // which is set up above will not be called.
    // Refer to issue #28 in the repo.
    // Solution: force focus on the element that the click event fired on
    $("#navbarToggle").click(function (event) {
      $(event.target).focus();
    });
  });


  //Dynamic load
  (function (global) {

    var dc = {};
    
    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl =
      "https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    
    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };
    
    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
      var html = "<div class='text-center'>";
      html += "<img src='images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
    };

    // Return substitute of '{{propName}}'
// with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) { 
        //grab the stings and substitute every property with {{}} with value
        //insert string into propName and propValue
        //it wil return the string already with those property values inserted
        var propToReplace = "{{" + propName + "}}";
        string = string
        .replace(new RegExp(propToReplace, "g"), propValue);
        //specify tag 'g' -> replace everywhere you find
        return string;
    }
        
    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
    
    // On first load, show home view
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest( //one loaded, it will do ajax request
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content")
          .innerHTML = responseText;
      },
      false); //false = don't want this as JSON
    });

    // Load the menu categories view
    //triggered to pull all categories into pages
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
        allCategoriesUrl,
        buildAndShowCategoriesHTML); //true by default
    };

    // Builds HTML for the categories page based on the data
// from the server
    function buildAndShowCategoriesHTML (categories) {
        // Load title snippet of categories page
        $ajaxUtils.sendGetRequest(
        categoriesTitleHtml,
        function (categoriesTitleHtml) {
            // Retrieve single category snippet
            // make sense because we want to get request after the title
            $ajaxUtils.sendGetRequest(
            categoryHtml,
            function (categoryHtml) {
                var categoriesViewHtml =
                buildCategoriesViewHtml(categories,
                                        categoriesTitleHtml,
                                        categoryHtml);
                insertHtml("#main-content", categoriesViewHtml); //place inside element with ID main-content
            },
            false);
        },
        false); //false because we don't want it as JSON
    }
  
  
  // Using categories data and snippets html
  // build categories view HTML to be inserted into page
  function buildCategoriesViewHtml(categories,
                                   categoriesTitleHtml,
                                   categoryHtml) {
  
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>"; 
  
    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml; //copy by value
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html =
        insertProperty(html, "name", name);
      html =
        insertProperty(html,
                       "short_name",
                       short_name); //loop insert text for name and short name
      finalHtml += html;
    }
  
    finalHtml += "</section>";
    return finalHtml;
  }
  
    
    
    global.$dc = dc;
    
    })(window);