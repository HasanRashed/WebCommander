    "use strict";
    /*------------------------------------------------------------------
    [Global variable declarations]
    -------------------------------------------------------------------*/
    // The numeric id of the items in the list
    var absolute_id;
    // Flag to keep track of the file being opened
    var modal_open = 0;
    // Flag to keep track of the textarea being edited
    var modal_edit = 0;
    // Flag to keep track of the folder being opened
    var modal_expand = 0;
    // Flag to keep track if small or large screen
    var mobile_device = 0;
    // Get the url on click or enter
    var clickURL;
    // Get file or folder on click or enter
    var clickType;
    // Get the alpha-numeric id of the item in the list
    var current_id;
    // Get the current window of the selected list - one or two
    var current_window;
    // Get the target window of the selected list - two or one
    var destination_window;
    // Variable to dynamically select the window
    var get_sidebar;
    // Get the content of the search string
    var search_content;
    // get the string where search is being operated
    var search_target;
    // Number of matches in the search
    var search_count;
    // Keep track of the next position of the matched searches
    var search_next_position;
    // Keep track of the total search position
    var search_position;
    // Get the window height for smooth keyboard scroll
    var window_position;
    // Get the position of the selected item
    var select_position;
    // Get the bottom position of the selected item
    var select_position_bottom;
    // Get the top position of the selected item
    var select_position_top;
    /*------------------------------------------------------------------
    [Display only selected item window in mobile device]
    -------------------------------------------------------------------*/
    function getMobilePosition(mobile_position) {
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        destination_window = (current_window == 'one') ? 'two' : 'one';
        if (mobile_position == 1) {
            $('.ui.segment.' + destination_window).css("display", "none");
            // Flag true if mobile device
            mobile_device = 1;
        } else {
            $('.ui.segment.' + destination_window).css("display", "inline-block");
            // Flag false if not mobile device
            mobile_device = 0;
        }
    }
    /*------------------------------------------------------------------
    [Div positions in big screen devices]
    -------------------------------------------------------------------*/
    function big_device_position() {
        $('.ui.horizontal.segments').css('height', $(window).height() - 83);
        $('.ui.display.sidebar').css('min-height', $(window).height() - 95);
        $('.ui.display.sidebar').css('max-height', $(window).height() - 95);
    }
    /*------------------------------------------------------------------
    [Div positions in small screen devices]
    -------------------------------------------------------------------*/
    function small_device_position() {
        $('.ui.horizontal.segments').css('height', $(window).height() - 49);
        $('.ui.display.sidebar').css('min-height', $(window).height() - 45);
        $('.ui.display.sidebar').css('max-height', $(window).height() - 45);
    }
    /*------------------------------------------------------------------
    [Get item window height for smooth scrolling]
    -------------------------------------------------------------------*/
    function window_position_for_device() {
        window_position = $('.ui.segments').height();
    }
    /*------------------------------------------------------------------
    [Get window size when loaded and resized]
    -------------------------------------------------------------------*/
    $(document).ready(function() {
        // Get first item in left window selected when page loaded
        $('#one-1').addClass('selected');
        textareaResizer();
        // window position when page loaded
        if ($(window).width() < 768) {
            getMobilePosition(1);
            small_device_position();
        } else {
            getMobilePosition(0);
            big_device_position();
        }
        window_position_for_device();
        // window position when page resized
        $(window).resize(function() {
            if ($(window).width() < 768) {
                getMobilePosition(1);
                small_device_position();
            } else {
                getMobilePosition(0);
                big_device_position();
            }
            window_position_for_device();
        });
    });
    /*------------------------------------------------------------------
    [Show and hide mobile menu button]
    -------------------------------------------------------------------*/
    $(".ui.bars.button").on("click", function(event) {
        // Open sidebar on click
        $('.ui.sidebar.inverted.vertical.mobile.menu')
            .sidebar({
                direction: 'left',
                // stop all other operation after menu click
                onVisible: function() {
                    modal_open = 1;
                    modal_edit = 1;
                    modal_expand = 1;
                },
                // resume all other operation after manu is closed
                onHidden: function() {
                    modal_open = 0;
                    modal_edit = 0;
                    modal_expand = 0;
                }
            })
            .sidebar('toggle');
    });
    /*------------------------------------------------------------------
    [Mobile menu for small devices]
    -------------------------------------------------------------------*/
    $(".ui.sidebar.mobile.menu .item").on("click", function(event) {
        // Close sidebar on menu selection
        $('.ui.sidebar.inverted.vertical.mobile.menu')
            .sidebar("hide")
    });
    /*------------------------------------------------------------------
    [View and hide mobile navigation buttons]
    -------------------------------------------------------------------*/
    $(".ui.keyboard.button").on("click", function(event) {
        $('.ui.vertical.icon.menu').transition('fade left');
    });
    /*------------------------------------------------------------------
    [Update user table on ajax call]
    -------------------------------------------------------------------*/
    function updateUserTable() {
        var userString = 'viewUserTable=0';
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: userString,
            cache: false,
            success: function(html) {
                // Update the content of table
                $('.ui.basic.user.segment').html(html);
                return true;
            }
        });
    }
    /*------------------------------------------------------------------
    [Delete from user table]
    -------------------------------------------------------------------*/
    $("body").on("click", ".user-delete", function(event) {
        event.preventDefault();
        // Get user id to delete
        var clickedID = this.id.split('-');
        var DbNumberID = clickedID[1];
        var deleteUser = 'userToDelete=' + DbNumberID;
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: deleteUser,
            cache: false,
            success: function(user_delete) {
                // Update user table
                updateUserTable();
                return true;
            }
        });
    });
    /*------------------------------------------------------------------
    [View folder content and refresh window]
    -------------------------------------------------------------------*/
    function viewFileFolder(window_url, window_to_reload, if_selected) {
        var reloadString = 'viewFileFolder=' + window_url + '&window=' + window_to_reload;
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: reloadString,
            cache: false,
            success: function(html) {
                // Reload window content with folder content
                $('.ui.segment.' + window_to_reload).html(html);
                // Scroll window to top
                $('.ui.segment.' + window_to_reload).animate({
                    scrollTop: 0
                }, 0);
                // Select top item if refreshed in same window
                if (if_selected)
                    $('#' + window_to_reload + '-1').addClass('selected');
                modal_expand = 0;
                return true;
            }
        });
    }
    /*------------------------------------------------------------------
    [View success or error message]
    -------------------------------------------------------------------*/
    function showMessage(success_or_error, message) {
        // Show success color
        if (success_or_error == 1)
            $('.ui.message').removeClass("error").addClass("success");
        // Show error color
        else
            $('.ui.message').removeClass("success").addClass("error");
        // Append message in the message box
        $('.ui.message h4').html(message);
        // Display message
        $('.ui.message').transition('swing down');
        setTimeout(function() {
            $('.ui.message').transition('swing down');
        }, 2000);
    }
    /*------------------------------------------------------------------
    [Save file in sidebar view after editing]
    -------------------------------------------------------------------*/
    function saveFileContent() {
        // Get file content after editing to send to ajax
        var saveFileContent = 'saveFileContent=' + encodeURIComponent($('#' + get_sidebar + '-code').val()) + '&url=' + clickURL;
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            processData: false,
            data: saveFileContent,
            cache: false,
            success: function(html) {
                if (html == "Success") {
                    // After saving update file size and datetime
                    var saveFileContent = 'getSizeDateTime=' + clickURL;
                    $.ajax({
                        type: "POST",
                        url: "WebC/scripts/index.ajax.php",
                        processData: false,
                        data: saveFileContent,
                        cache: false,
                        success: function(html) {
                            // View update filename, size and datetime
                            var fields = html.split('+');
                            $('tr.itemObject[data-url="' + clickURL + '"] td:nth-child(2)').html(fields[0]);
                            $('tr.itemObject[data-url="' + clickURL + '"] td:nth-child(3)').html(fields[1]);
                            return true;
                        }
                    });
                    return true;
                }
            }
        });
    }
    /*------------------------------------------------------------------
    [Click close button on file view sidebar]
    -------------------------------------------------------------------*/
    $(".save.button").on("click", function(event) {
        // Unselect button
        this.blur();
        // Get item and window variables
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        clickURL = $(".selected").attr("data-url");
        if (current_window == "one")
            get_sidebar = "right";
        else
            get_sidebar = "left";
        saveFileContent();
        showMessage(1, "File saved successfully...");
        modal_edit = 0;
    });
    /*------------------------------------------------------------------
    [Click close button on file view sidebar]
    -------------------------------------------------------------------*/
    $(".ui.close.button").on("click", function(event) {
        // Unselect button
        this.blur();
        // Get item and window variables
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        clickURL = $(".selected").attr("data-url");
        if (current_window == "one")
            get_sidebar = "right";
        else
            get_sidebar = "left";
        // Close sidebar if no editing done
        if (modal_edit == 0) {
            $(".ui." + get_sidebar + ".sidebar.vertical.menu").sidebar("hide");
            // Remove textarea content
            $('#' + get_sidebar + '-code').html("");
        }
        // If edited, show warning to close before saving
        else
            $(".ui.mini.access.modal")
            .modal({
                closable: false,
                // Insert access modal content
                onShow: function() {
                    $(".ui.mini.access.modal > .header:not(.ui)").html("Unsaved Content");
                    $(".ui.mini.access.modal > .content p").html("Are you sure you want to close without saving?");
                    $(".ui.modal .actions > .approve.button").html("Save");
                },
                // Open other actions if cancelled and close sidebar
                onDeny: function() {
                    modal_edit = 0;
                    $(".ui." + get_sidebar + ".sidebar.vertical.menu").sidebar("hide");
                    // Remove textarea content
                    $('#' + get_sidebar + '-code').html("");
                },
                // On approve, save sidebar content to file and close
                onApprove: function() {
                    modal_edit = 0;
                    saveFileContent();
                    $(".ui." + get_sidebar + ".sidebar.vertical.menu").sidebar("hide");
                    // Remove textarea content
                    $('#' + get_sidebar + '-code').html("");
                    // Show save success message
                    showMessage(1, "File saved successfully...");
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
    });
    /*------------------------------------------------------------------
    [Copy file and folder to other window location]
    -------------------------------------------------------------------*/
    $(".copy-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Get item and window information
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        destination_window = (current_window == 'one') ? 'two' : 'one';
        clickURL = $(".selected").attr("data-url");
        clickType = $(".selected").attr("data-type");
        absolute_id = current_id.replace(current_window + "-", "");
        // Show copy modal if not root and upper directory
        if (absolute_id != 1 && absolute_id != 2 && $('#one-window').val() != $('#two-window').val())
            $(".ui.mini.access.modal")
            .modal({
                closable: false,
                // Inject modal information
                onShow: function() {
                    $(".ui.mini.access.modal > .header:not(.ui)").html("Copy Content");
                    $(".ui.mini.access.modal > .content p").html("Are you sure you want to copy?<br><a class='src-text'>" + (clickType.indexOf("type-folder") >= 0 ? "Folder: " : "File: ") + clickURL.substring(clickURL.lastIndexOf('/') + 1) + "</a><br><a class='dst-text'>Location: " + $('#' + destination_window + '-window').val() + "</a>");
                    $(".ui.modal .actions > .approve.button").html("Copy");
                },
                // Open other actions if cancelled
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                },
                // Copy item if approved
                onApprove: function() {
                    var copyString = 'copyURL=' + clickURL + '&copyFolder=' + $('#' + destination_window + '-window').val();
                    $.ajax({
                        type: "POST",
                        url: "WebC/scripts/index.ajax.php",
                        data: copyString,
                        cache: false,
                        // Before send animation if big file/folder
                        beforeSend: function() {
                            $('.ui.active.dimmer').removeClass('hidden-content');
                            $('.ui.indeterminate.text.loader').html('Copying files...');
                        },
                        // Activity after successful copy
                        success: function(html) {
                            if (html == "Success") {
                                // Refresh destination location
                                viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                                $('.ui.active.dimmer').addClass('hidden-content');
                                // Show successful message
                                showMessage(1, "File(s) copied successfully...");
                                // Open other actions when done 
                                modal_open = 0;
                                modal_expand = 0;
                                return true;
                            }
                        }
                    });
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
        else {
            // Error message for rool and upper directory
            if (absolute_id == 1 || absolute_id == 2)
                $('p.error').html('Cannot copy up/root directory!');
            // Error message for same window
            else if ($('#one-window').val() == $('#two-window').val())
                $('p.error').html('Cannot copy to same location!');
            $(".ui.mini.error.modal")
                .modal({
                    closable: false,
                    // Open other actions if error
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        }
    });
    /*------------------------------------------------------------------
    [Move file and folder to other window location]
    -------------------------------------------------------------------*/
    $(".move-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Get item and window information
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        destination_window = (current_window == 'one') ? 'two' : 'one';
        clickURL = $(".selected").attr("data-url");
        clickType = $(".selected").attr("data-type");
        absolute_id = current_id.replace(current_window + "-", "");
        // Show copy modal if not root, upper directory and within the folder
        if (absolute_id != 1 && absolute_id != 2 && $('#one-window').val() != $('#two-window').val() && $('#' + destination_window + '-window').val().indexOf(clickURL) < 0)
            $(".ui.mini.access.modal")
            .modal({
                closable: false,
                // Inject modal information
                onShow: function() {
                    $(".ui.mini.access.modal > .header:not(.ui)").html("Move Content");
                    $(".ui.mini.access.modal > .content p").html("Are you sure you want to move?<br><a class='src-text'>" + (clickType.indexOf("type-folder") >= 0 ? "Folder: " : "File: ") + clickURL.substring(clickURL.lastIndexOf('/') + 1) + "</a><br><a class='dst-text'>Location: " + $('#' + destination_window + '-window').val() + "</a>");
                    $(".ui.modal .actions > .approve.button").html("Move");
                },
                // Open other actions if cancelled
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                },
                // Move item if approved
                onApprove: function() {
                    var moveString = 'moveURL=' + clickURL + '&moveFolder=' + $('#' + destination_window + '-window').val();
                    $.ajax({
                        type: "POST",
                        url: "WebC/scripts/index.ajax.php",
                        data: moveString,
                        cache: false,
                        // Before send animation if big file/folder
                        beforeSend: function() {
                            $('.ui.active.dimmer').removeClass('hidden-content');
                            $('.ui.indeterminate.text.loader').html('Moving files...');
                        },
                        // Activity after successful move
                        success: function(html) {
                            if (html == "Success") {
                                // Refresh destination location
                                viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                                // Refresh source location
                                viewFileFolder($('#' + current_window + '-window').val(), current_window, 1);
                                $('.ui.active.dimmer').addClass('hidden-content');
                                // Show successful message
                                showMessage(1, "File(s) moved successfully...");
                                // Open other actions when done 
                                modal_open = 0;
                                modal_expand = 0;
                                return true;
                            }
                        }
                    });
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
        else {
            // Error message for rool and upper directory
            if (absolute_id == 1 || absolute_id == 2)
                $('p.error').html('Cannot move up/root directory!');
            // Error message for same window
            else if ($('#one-window').val() == $('#two-window').val())
                $('p.error').html('Cannot move to same location!');
            // Error message for within window
            else if ($('#' + destination_window + '-window').val().indexOf(clickURL) >= 0)
                $('p.error').html('Cannot move inside its own location!');
            $(".ui.mini.error.modal")
                .modal({
                    closable: false,
                    onDeny: function() {
                        // Open other actions if error
                        modal_open = 0;
                        modal_expand = 0;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        }
    });
    /*------------------------------------------------------------------
    [File select actions in upload modal]
    -------------------------------------------------------------------*/
    $(function() {
        // Detect when selection initiated
        $("input:file").change(function() {
            // Get window for upload location
            current_id = $('.selected').attr('id');
            current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
            // Check if no file selected and send message
            if ($("input:file").get(0).files.length === 0) {
                $(".ui.demo-upload p").html("No file selected...");
                return false;
            }
            // If selected, output file name and location to upload
            else
                $(".ui.demo-upload p").html("<p>Are you sure you want to upload?<br><a class='src-txt'>File: " + $('input[type=file]').val().replace(/C:\\fakepath\\/i, '') +
                    "</a><br><a class='dst-txt'>Location: " + $('#' + current_window + '-window').val() + "</a></p>");
        });
    });
    /*------------------------------------------------------------------
    [Upload files to destination location]
    -------------------------------------------------------------------*/
    $(".ui.send-upload.button").click(function() {
        // Return with message if no file selected
        if ($("input:file").get(0).files.length === 0) {
            $(".ui.demo-upload p").html("No file selected...");
            return false;
        }
        // Get window information
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        destination_window = (current_window == 'one') ? 'two' : 'one';
        // File data to upload
        var fileUpload = new FormData();
        var files = $('#file_upload')[0].files[0];
        fileUpload.append('file', files);
        fileUpload.append('fileLocation', $('#' + current_window + '-window').val());
        $.ajax({
            url: 'WebC/scripts/index.ajax.php',
            type: 'post',
            data: fileUpload,
            contentType: false,
            processData: false,
            // Before upload show progress
            beforeSend: function() {
                $(".ui.mini.upload.modal")
                    .modal("hide");
                $('.ui.active.dimmer').removeClass('hidden-content');
                $('.ui.indeterminate.text.loader').html('Uploading file...');
            },
            success: function(response) {
                // Hide progress after completion
                $('.ui.active.dimmer').addClass('hidden-content');
                if (response == "Success") {
                    // View destination folder after upload
                    viewFileFolder($('#' + current_window + '-window').val(), current_window, 1);
                    // View the other folder
                    if ($('#one-window').val() == $('#two-window').val())
                        viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                    // Show success message after upload
                    showMessage(1, "File(s) uploaded successfully...");
                } else {
                    // Show error message if failed
                    showMessage(0, "Couldn't upload file...");
                }
                // Enable all actions
                modal_open = 0;
                modal_expand = 0;
                return true;
            },
        });
    });
    /*------------------------------------------------------------------
    [Upload files to destination location]
    -------------------------------------------------------------------*/
    $(".upload-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Set file input as blank everytime the modal is called
        var $uload = $('#file_upload');
        $uload.wrap('<form>').closest('form').get(0).reset();
        $uload.unwrap();
        // Show upload modal
        $(".ui.demo-upload p").html("Click to upload file...");
        $(".ui.mini.upload.modal")
            .modal({
                closable: false,
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
    });
    /*------------------------------------------------------------------
    [Zip file or folder]
    -------------------------------------------------------------------*/
    $(".zip-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Get window for upload location
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        clickURL = $(".selected").attr("data-url");
        clickType = $(".selected").attr("data-type");
        // Get absolute id for selected item
        absolute_id = current_id.replace(current_window + "-", "");
        // View zip modal if not root or up directory
        if (absolute_id != 1 && absolute_id != 2)
            $(".ui.mini.access.modal")
            .modal({
                closable: false,
                // Insert modal information
                onShow: function() {
                    $(".ui.mini.access.modal > .header:not(.ui)").html("Zip Content");
                    $(".ui.mini.access.modal > .content p").html("Are you sure you want to zip?<br><a class='src-text'>" + (clickType.indexOf("type-folder") >= 0 ? "Folder: " : "File: ") + clickURL.substring(clickURL.lastIndexOf('/') + 1) + "</a><br><a class='dst-text'>Location: " + $('#' + current_window + '-window').val() + "</a>");
                    $(".ui.modal .actions > .approve.button").html("Zip");
                },
                // Open other actions if closed
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                },
                // Create zip file if approved
                onApprove: function() {
                    // Get opposite window information if same window
                    destination_window = (current_window == 'one') ? 'two' : 'one';
                    var zipString = 'zipURL=' + clickURL + '&zipLocation=' + $('#' + current_window + '-window').val();
                    $.ajax({
                        type: "POST",
                        url: "WebC/scripts/index.ajax.php",
                        data: zipString,
                        cache: false,
                        // Before send animation if big file/folder
                        beforeSend: function() {
                            $('.ui.active.dimmer').removeClass('hidden-content');
                            $('.ui.indeterminate.text.loader').html('Zipping files...');
                        },
                        success: function(html) {
                            // Refresh window(s) if success
                            if (html == "Success") {
                                viewFileFolder($('#' + current_window + '-window').val(), current_window, 1);
                                if ($('#one-window').val() == $('#two-window').val())
                                    viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                                $('.ui.active.dimmer').addClass('hidden-content');
                                // Show success message after compress
                                showMessage(1, "File(s) compressed successfully...");
                                modal_open = 0;
                                modal_expand = 0;
                                return true;
                            }
                        }
                    });
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
        else {
            // Error message for rool and upper directory
            if (absolute_id == 1 || absolute_id == 2)
                $('p.error').html('Cannot zip up/root directory!');
            // Show error modal
            $(".ui.mini.error.modal")
                .modal({
                    closable: false,
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        }
    });
    /*------------------------------------------------------------------
    [Download file]
    -------------------------------------------------------------------*/
    $(".download-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Get file variables to download
        clickType = $(".selected").attr("data-type");
        clickURL = $(".selected").attr("data-url");
        // Error modal if folder, root or up directory is selected for download 
        if (clickType != "zip-file") {
            $('p.error').html('Cannot download non-zipped files!');
            $(".ui.mini.error.modal")
                .modal({
                    closable: false,
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
            // Show modal to download
        } else {
            $(".ui.mini.access.modal")
                .modal({
                    closable: false,
                    // Get the file link convert it to downloadable link
                    onShow: function() {
                        var downloadString = 'downloadURL=' + clickURL;
                        $.ajax({
                            type: "POST",
                            url: "WebC/scripts/index.ajax.php",
                            data: downloadString,
                            cache: false,
                            success: function(download_url) {
                                $(".ui.mini.access.modal > .header:not(.ui)").html("Download File");
                                $(".ui.mini.access.modal > .content p").html("Are you sure you want to download<br><a class='download-src' href='" + download_url + "' download>" + clickURL.substring(clickURL.lastIndexOf('/') + 1) + "</a>");
                                $(".ui.modal .actions > .approve.button").html("Download");
                                return true;
                            }
                        });
                    },
                    // Open other actions if closed
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    },
                    // Trigger click if approved
                    onApprove: function() {
                        $('a.download-src')[0].click();
                        modal_open = 0;
                        modal_expand = 0;
                        return true;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        }
    });
    /*------------------------------------------------------------------
    [Create file or folder]
    -------------------------------------------------------------------*/
    $(".create-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Show modal to create file/folder
        $(".ui.mini.text.modal")
            .modal({
                closable: false,
                // Insert modal information
                onShow: function() {
                    $(".ui.mini.text.modal > .header:not(.ui)").html("Create Item");
                    $(".create-item").removeClass("hidden-content");
                    $(".ui.mini.text.modal .actions > .create.button").removeClass("hidden-content");
                    $(".ui.mini.text.modal .actions > .create.button").html("Create");
                    $('#input-text').val("");
                    $("#dir-option").prop("checked", false);
                },
                // Remove modal info and open other actions if closed
                onDeny: function() {
                    $(".create-item").addClass("hidden-content");
                    $(".ui.mini.text.modal .actions > .create.button").addClass("hidden-content");
                    $('.text-entry-error').removeClass("error");
                    modal_open = 0;
                    modal_expand = 0;
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
    });
    /*------------------------------------------------------------------
    [Create file/folder on click]
    -------------------------------------------------------------------*/
    $(".create.button").on("click", function(event) {
        // Error if no input name
        if ($('#input-text').val() == "") {
            $('.text-entry-error').addClass("error");
            showMessage(0, "File/folder name required...");
            return false;
        }
        // Get window information
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        destination_window = (current_window == 'one') ? 'two' : 'one';
        // Create path for file/folder
        var createString = 'currentPath=' + $('#' + current_window + '-window').val() + '&createItem=' + $('#input-text').val() + '&createOption=' + $('#dir-option').is(':checked').toString();
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: createString,
            cache: false,
            // Before send animation if big file/folder
            beforeSend: function() {
                // Hide modal
                $(".ui.mini.text.modal")
                    .modal("hide");
                // Remove modal info and open other actions if closed
                $(".create-item").addClass("hidden-content");
                $(".ui.mini.text.modal .actions > .create.button").addClass("hidden-content");
                $('.text-entry-error').removeClass("error");
                // Show progress
                $('.ui.active.dimmer').removeClass('hidden-content');
                $('.ui.indeterminate.text.loader').html('Creating item...');
            },
            success: function(message) {
                // Create file/folder and show message
                if (message.indexOf("File already exists...") < 0 && message.indexOf("Folder already exists...") < 0) {
                    viewFileFolder($('#' + current_window + '-window').val(), current_window, 1);
                    viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                    showMessage(1, message);
                }
                // Show error message if already exists
                else
                    showMessage(0, message);
                $('.ui.active.dimmer').addClass('hidden-content');
                $('#input-text').val("");
                // Open other activities
                modal_open = 0;
                modal_expand = 0;
                return true;
            }
        });
    });
    /*------------------------------------------------------------------
    [Delte file or folder]
    -------------------------------------------------------------------*/
    $(".trash-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Get window for delete location
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        clickURL = $(".selected").attr("data-url");
        clickType = $(".selected").attr("data-type");
        // Get absolute id for selected item
        absolute_id = current_id.replace(current_window + "-", "");
        // View delete modal if not root or up directory
        if (absolute_id != 1 && absolute_id != 2)
            $(".ui.mini.access.modal")
            .modal({
                closable: false,
                // Insert modal information
                onShow: function() {
                    $(".ui.mini.access.modal > .header:not(.ui)").html("Delete Content");
                    $(".ui.mini.access.modal > .content p").html("Are you sure you want to delete?<br><a class='src-text'>" + (clickType.indexOf("type-folder") >= 0 ? "Folder: " : "File: ") + clickURL.substring(clickURL.lastIndexOf('/') + 1) + "</a>");
                    $(".ui.modal .actions > .approve.button").html("Delete");
                },
                // Open other actions if closed
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                },
                // Create zip file if approved
                onApprove: function() {
                    // Get opposite window information if same window
                    destination_window = (current_window == 'one') ? 'two' : 'one';
                    var deleteString = 'deleteURL=' + clickURL;
                    $.ajax({
                        type: "POST",
                        url: "WebC/scripts/index.ajax.php",
                        data: deleteString,
                        cache: false,
                        // Before send animation if big file/folder
                        beforeSend: function() {
                            $('.ui.active.dimmer').removeClass('hidden-content');
                            $('.ui.indeterminate.text.loader').html('Removing files...');
                        },
                        success: function(message) {
                            // Refresh window(s) if success
                            viewFileFolder($('#' + current_window + '-window').val(), current_window, 1);
                            if ($('#one-window').val() == $('#two-window').val())
                                viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                            $('.ui.active.dimmer').addClass('hidden-content');
                            // Show success message after compress
                            showMessage(1, message);
                            modal_open = 0;
                            modal_expand = 0;
                            return true;
                        }
                    });
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
        else {
            // Error message for rool and upper directory
            if (absolute_id == 1 || absolute_id == 2)
                $('p.error').html('Cannot delete up/root directory!');
            // Show error modal
            $(".ui.mini.error.modal")
                .modal({
                    closable: false,
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        }
    });
    /*------------------------------------------------------------------
    [Rename file or folder]
    -------------------------------------------------------------------*/
    $(".rename-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        current_id = $('.selected').attr('id');
        clickURL = $(".selected").attr("data-url");
        clickType = $(".selected").attr("data-type");
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        absolute_id = current_id.replace(current_window + "-", "");
        // Show modal to create file/folder if not root and up directory
        if (absolute_id != 1 && absolute_id != 2)
            $(".ui.mini.text.modal")
            .modal({
                closable: false,
                onShow: function() {
                    $(".ui.mini.text.modal > .header:not(.ui)").html("Rename Content");
                    $(".ui.mini.text.modal > .content p").html("<a class='src-text'>" + (clickType.indexOf("type-folder") >= 0 ? "Folder: " : "File: ") + clickURL.substring(clickURL.lastIndexOf('/') + 1) + "</a>");
                    $(".ui.modal .actions > .approve.button").html("Rename");
                    $(".ui.mini.text.modal .actions > .rename.button").removeClass("hidden-content");
                    $(".ui.mini.text.modal .actions > .rename.button").html("Rename");
                    $('#input-text').val("");
                },
                onDeny: function() {
                    $(".ui.mini.text.modal > .content p").html("");
                    $(".ui.mini.text.modal .actions > .rename.button").addClass("hidden-content");
                    $('.text-entry-error').removeClass("error");
                    modal_open = 0;
                    modal_expand = 0;
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
        else {
            // Error message for rool and upper directory
            if (absolute_id == 1 || absolute_id == 2)
                $('p.error').html('Cannot rename up/root directory!');
            // Show error modal
            $(".ui.mini.error.modal")
                .modal({
                    closable: false,
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        }
    });
    /*------------------------------------------------------------------
    [Rename file/folder on click]
    -------------------------------------------------------------------*/
    $(".rename.button").on("click", function(event) {
        // Error if no input name
        if ($('#input-text').val() == "") {
            $('.text-entry-error').addClass("error");
            showMessage(0, "File/folder name required...");
            return false;
        }
        // Get window information
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        clickURL = $(".selected").attr("data-url");
        destination_window = (current_window == 'one') ? 'two' : 'one';
        // Get items to rename
        var renameString = 'renameURL=' + clickURL + '&renameName=' + $('#input-text').val();
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: renameString,
            cache: false,
            // Before send animation if big file/folder
            beforeSend: function() {
                // Hide modal
                $(".ui.mini.text.modal")
                    .modal("hide");
                // Remove elements from modal
                $(".ui.mini.text.modal > .content p").html("");
                $(".ui.mini.text.modal .actions > .rename.button").addClass("hidden-content");
                $('.text-entry-error').removeClass("error");
                // View progress
                $('.ui.active.dimmer').removeClass('hidden-content');
                $('.ui.indeterminate.text.loader').html('Renaming file/folder...');
            },
            // Rename file/folder and show message
            success: function(message) {
                viewFileFolder($('#' + current_window + '-window').val(), current_window, 1);
                if ($('#one-window').val() == $('#two-window').val())
                    viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                // Error if already exists
                if (message.indexOf("exists") >= 0)
                    showMessage(0, message);
                // Or show success message
                else
                    showMessage(1, message);
                $('.ui.active.dimmer').addClass('hidden-content');
                // Open other actions
                modal_open = 0;
                modal_expand = 0;
                return true;
            }
        });
    });
    /*------------------------------------------------------------------
    [Search for file modal]
    -------------------------------------------------------------------*/
    $(".search-action").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Prepare search modal
        $('#search-item').val('');
        $("#root-dir").prop("checked", false);
        $(".ui.basic.result.segment").html("");
        // View the modal
        $(".ui.tiny.search.modal")
            .modal({
                closable: false,
                // Insert modal inforamtion
                onShow: function() {
                    $(".ui.tiny.search.modal > .header:not(.ui)").html("Find File");
                    $('.search-entry-error').removeClass("error");

                },
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                },
                // Set elements before exit
                onHidden: function() {
                    $('#search-item').val('');
                    $("#root-dir").prop("checked", false);
                    $(".ui.basic.result.segment").html('');
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
    });
    /*------------------------------------------------------------------
    [Show search result on submit]
    -------------------------------------------------------------------*/
    $('#search-form').submit(function(event) {
        event.preventDefault();
        // Get window information
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        // Show error when empty search
        $(".ui.basic.result.segment").html("");
        if ($('#search-item').val() == "") {
            $('.search-entry-error').addClass("error");
            return false;
        }
        // Disable options when search submitted
        $('.ui.find-start.button').addClass("disabled");
        $('.ui.find-close.button').addClass("disabled");
        $('.search-entry-error').removeClass("error");
        // Get the keyword and send for search
        var formData = $('#search-form').serialize() + '&viewFileFolder=' + $('#' + current_window + '-window').val();
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: formData,
            cache: false,
            success: function(html) {
                // Get search result and display
                if (html != "")
                    $(".ui.basic.result.segment").html(html);
                // Show message if not found
                else
                    $(".ui.basic.result.segment").html("<h4 class='ui center aligned orange header'>No results found!</h4>");
                // Enable the modal after search completed
                $('.ui.find-start.button').removeClass("disabled");
                $('.ui.find-close.button').removeClass("disabled");
                return true;
            }
        });
    });
    /*------------------------------------------------------------------
    [Set file/folder permission]
    -------------------------------------------------------------------*/
    $("body").on("click", ".perm-content", function() {
        // Get all file/folder permission 
        var formData = $('#perm-content').serialize();
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: formData,
            cache: false,
            success: function(html) {
                // Message if success
                if (html == "Success")
                    showMessage(1, "Permission set successfully...");
                // Message if error
                else
                    showMessage(0, "Invalid permission parameters...");
                return true;
            }
        });
    });
    /*------------------------------------------------------------------
    [View and edit file/folder permission]
    -------------------------------------------------------------------*/
    $(".ui.permission.button").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Get item and window information
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        clickURL = $(".selected").attr("data-url");
        absolute_id = current_id.replace(current_window + "-", "");
        // Show properties modal if not root and upper directory
        if (absolute_id != 1 && absolute_id != 2) {
            // View modal on button click
            $(".ui.mini.prop.modal")
                .modal({
                    closable: false,
                    // Dynamically update modal with php.ini parameters settings
                    onVisible: function() {
                        $('.ui.prop.modal > .content .lnk-text').html(clickURL);
                        var iniString = 'permissionURL=' + clickURL;
                        $.ajax({
                            type: "POST",
                            url: "WebC/scripts/index.ajax.php",
                            data: iniString,
                            cache: false,
                            success: function(html) {
                                $('#perm-content').html(html);
                                return true;
                            }
                        });
                    },
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    },
                    // Open other actions if cancelled
                    onHidden: function() {
                        $('.ui.prop.modal > .content .lnk-text').html("");
                        $('#perm-content').html("");
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        } else {
            // Error message for rool and upper directory
            if (absolute_id == 1 || absolute_id == 2)
                $('p.error').html('Cannot set permission for up/root directory!');
            $(".ui.mini.error.modal")
                .modal({
                    closable: false,
                    // Open other actions if error
                    onDeny: function() {
                        modal_open = 0;
                        modal_expand = 0;
                    }
                })
                .modal('setting', 'transition', 'pulse')
                .modal("show");
        }
    });
    /*------------------------------------------------------------------
    [View app info modal]
    -------------------------------------------------------------------*/
    $(".ui.info.button").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        clickURL = $(".selected").attr("data-url");
        absolute_id = current_id.replace(current_window + "-", "");
        $(".ui.mini.info.modal")
            .modal({
                closable: false,
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                }
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
    });
    /*------------------------------------------------------------------
    [View user modal]
    -------------------------------------------------------------------*/
    $(".ui.user.icon.button").on("click", function(event) {
        // Restrict other action
        modal_open = 1;
        modal_expand = 1;
        // Unselect button
        this.blur();
        // Remove error from user form
        $('.user-name-error, .user-password-error, .user-access-error').removeClass('error');
        // Empty user form
        $('#user_name').val("");
        $('#user_password_hash').val("");
        $('#user_access').val("");
        // View modal on button click
        $(".ui.small.user.modal")
            .modal({
                closable: false,
                // Dynamically update modal with php.ini parameters settings
                onVisible: function() {
                    // Username input
                    $('.user-name-error').popup({
                        position: 'bottom center',
                        content: 'Minimum 2 characters - only letters & numbers'
                    });
                    // User password input
                    $('.user-password-error').popup({
                        position: 'bottom center',
                        content: 'Min. 6 characters - please include uppercase, number & symbol'
                    });
                    // User access input
                    $('.user-access-error').popup({
                        position: 'bottom center',
                        content: 'Use absolute path, or localhost for all access'
                    });
                },
                onDeny: function() {
                    modal_open = 0;
                    modal_expand = 0;
                },
                // Open other actions if cancelled
                onHidden: function() {}
            })
            .modal('setting', 'transition', 'pulse')
            .modal("show");
    });
    /*------------------------------------------------------------------
    [Update/create user in user database]
    -------------------------------------------------------------------*/
    $('#new-user').submit(function(event) {
        event.preventDefault();
        // Remove error from form
        $('.user-name-error, .user-password-error, .user-access-error').removeClass('error');
        var formData = $('#new-user').serialize();
        $.ajax({
                type: 'POST',
                url: 'WebC/scripts/index.ajax.php',
                data: formData,
                dataType: 'json',
                encode: true
            })
            .done(function(data) {
                if (data.success) {
                    // Empty user form
                    $('#user_name').val("");
                    $('#user_password_hash').val("");
                    $('#user_access').val("");
                    // Update user table
                    updateUserTable();
                    // Show success message
                    showMessage(1, "User information updated...");
                    return true;
                } else if ((data.errors.db_access || data.errors.user_name || data.errors.user_password_hash || data.errors.user_access)) {
                    if (data.errors.db_access) {
                        // Show error message if database error
                        showMessage(0, "Database error...");
                    } else {
                        // User name input error
                        if (data.errors.user_name) {
                            $('.user-name-error').addClass('error');
                        }
                        // Password input error
                        if (data.errors.user_password_hash) {
                            $('.user-password-error').addClass('error');
                        }
                        // Access folder error
                        if (data.errors.user_access) {
                            $('.user-access-error').addClass('error');
                        }
                        // Show error message if input error
                        showMessage(0, "Invalid user information...");
                    }
                    return false;
                }
            })
            .fail(function(data) {
                return false;
            });
    });
    /*------------------------------------------------------------------
    [Track if file edit textarea is changed]
    -------------------------------------------------------------------*/
    function textareaChange() {
        // Mark flag if edit operation is made
        $('#right-code').bind('input propertychange', function() {
            modal_edit = 1;
        })
        $('#left-code').bind('input propertychange', function() {
            modal_edit = 1;
        })
    }
    /*------------------------------------------------------------------
    [Resize textarea on window create/resize]
    -------------------------------------------------------------------*/
    function textareaResizer() {
        // Resize if small window
        if ($(window).width() < 768) {
            $('.ui.form textarea:not([rows])').css('min-height', $(window).height() - 112);
            // Resize if large window
        } else {
            $('.ui.form textarea:not([rows])').css('min-height', $(window).height() - 159);
        }
        $(window).resize(function() {
            // Resize if small window
            if ($(window).width() < 768) {
                $('.ui.form textarea:not([rows])').css('min-height', $(window).height() - 112);
                // Resize if large window
            } else {
                $('.ui.form textarea:not([rows])').css('min-height', $(window).height() - 159);

            }
        });
    }
    /*------------------------------------------------------------------
    [Enter of click function in file/folder]
    -------------------------------------------------------------------*/
    function doEnterFunction() {
        // Get url to check if file or folder
        var selectString = 'getFileFolder=' + clickURL;
        $.ajax({
            type: "POST",
            url: "WebC/scripts/index.ajax.php",
            data: selectString,
            cache: false,
            success: function(html) {
                // Action if file
                if (html.indexOf("File") >= 0) {
                    // Get file and window information
                    current_id = $('.selected').attr('id');
                    current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
                    if (current_window == "one")
                        get_sidebar = "right";
                    else
                        get_sidebar = "left";
                    // View if text file
                    if (clickType == "edit-file") {
                        // Get file content
                        var editFile = 'getFileContent=' + clickURL;
                        $.ajax({
                            type: "POST",
                            url: "WebC/scripts/index.ajax.php",
                            data: editFile,
                            cache: false,
                            // Display file content in sidebar textarea
                            success: function(html) {
                                $('.' + get_sidebar + '-panel.item').html("<form class='ui reply form'><div class='field'><textarea id='" + get_sidebar + "-code' name='" + get_sidebar + "-code' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false'></textarea></div></form>");
                                // Chech if textarea has been edited
                                textareaChange();
                                // Resize textarea to fit window
                                textareaResizer();
                                $('#' + get_sidebar + '-code').html(html);
                                return true;
                            }
                        });
                        // View sidebar with content
                        $('.ui.' + get_sidebar + '.sidebar.vertical.menu')
                            .sidebar({
                                closable: false,
                                direction: 'right',
                                onVisible: function() {
                                    modal_open = 1;
                                    $(".ui.menu .item > .input").css('display', 'inline-block');
                                },
                                onHidden: function() {
                                    modal_open = 0;
                                    modal_expand = 0;
                                    $(".ui.menu .item > .input").css('display', 'none');
                                }
                            })
                            .sidebar('setting', 'transition', 'overlay')
                            .sidebar('setting', 'mobileTransition', 'overlay')
                            .sidebar('toggle');
                        // View image file in window
                    } else if (clickType == "view-file") {
                        var viewFile = 'getImageContent=' + clickURL;
                        $.ajax({
                            type: "POST",
                            url: "WebC/scripts/index.ajax.php",
                            data: viewFile,
                            cache: false,
                            // Add image in sidebar if image
                            success: function(html) {
                                $('.' + get_sidebar + '-panel.item').html("<div id='" + get_sidebar + "-image'><img class='ui fluid image' src='" + html + "'></div>");
                                return true;
                            }
                        });
                        // View image sidebar
                        $('.ui.' + get_sidebar + '.sidebar.vertical.menu')
                            .sidebar({
                                closable: false,
                                direction: 'right',
                                // Remove save button is image
                                onVisible: function() {
                                    modal_open = 1;
                                    $('.' + get_sidebar + '.save.button').css('display', 'none');
                                },
                                onHidden: function() {
                                    modal_open = 0;
                                    modal_expand = 0;
                                    $('.' + get_sidebar + '.save.button').css('display', 'inline-block');
                                }
                            })
                            .sidebar('setting', 'transition', 'overlay')
                            .sidebar('setting', 'mobileTransition', 'overlay')
                            .sidebar('toggle');
                        // Check if compressed file
                    } else if (clickType == "zip-file") {
                        modal_open = 1;
                        current_id = $('.selected').attr('id');
                        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
                        clickURL = $(".selected").attr("data-url");
                        absolute_id = current_id.replace(current_window + "-", "");
                        // View access modal for permission to unzip
                        $(".ui.mini.access.modal")
                            .modal({
                                closable: false,
                                onShow: function() {
                                    $(".ui.mini.access.modal > .header:not(.ui)").html("Unzip Content");
                                    $(".ui.mini.access.modal > .content p").html("Are you sure you want to unzip?");
                                    $(".ui.modal .actions > .approve.button").html("Unzip");
                                },
                                onDeny: function() {
                                    modal_open = 0;
                                    modal_expand = 0;
                                },
                                // Unzip file if approved
                                onApprove: function() {
                                    destination_window = (current_window == 'one') ? 'two' : 'one';
                                    var unzipString = 'unzipURL=' + clickURL;
                                    $.ajax({
                                        type: "POST",
                                        url: "WebC/scripts/index.ajax.php",
                                        data: unzipString,
                                        cache: false,
                                        // Show dimmer for larget files
                                        beforeSend: function() {
                                            $('.ui.active.dimmer').removeClass('hidden-content');
                                            $('.ui.indeterminate.text.loader').html('Unzipping files...');
                                        },
                                        // Refresh window(s) if success
                                        success: function(html) {
                                            if (html == "Success") {
                                                viewFileFolder($('#' + current_window + '-window').val(), current_window, 1);
                                                if ($('#one-window').val() == $('#two-window').val())
                                                    viewFileFolder($('#' + destination_window + '-window').val(), destination_window, 0);
                                                $('.ui.active.dimmer').addClass('hidden-content');
                                                showMessage(1, "File unzipped successfully...");
                                                modal_open = 0;
                                                return true;
                                            }
                                        }
                                    });
                                }
                            })
                            .modal('setting', 'transition', 'pulse')
                            .modal("show");
                        // Show error if unrecognizable file
                    } else if (clickType == "null-file") {
                        modal_open = 1;
                        $('p.error').html('Unable to open or view file!');
                        $(".ui.mini.error.modal")
                            .modal({
                                closable: false,
                                onDeny: function() {
                                    modal_open = 0;
                                    modal_expand = 0;
                                }
                            })
                            .modal('setting', 'transition', 'pulse')
                            .modal("show");
                    }
                    // Explore if it is folder
                } else {
                    current_id = $('.selected').attr('id');
                    current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
                    viewFileFolder(clickURL, current_window, 1);
                }
                return true;
            }
        });
    }
    /*------------------------------------------------------------------
    [Select item on mouse click]
    -------------------------------------------------------------------*/
    function doMouseClickAction(click_id, click_type, click_url) {
        var click_window = (click_id.indexOf("one") >= 0) ? 'one' : 'two';
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        // Select operation if same window
        if (click_window == current_window) {
            $('#' + current_id).removeClass("selected");
            $('#' + click_id).addClass("selected");
            // Select operation is different window
        } else {
            $('#' + current_id).addClass('mark-' + current_window + '-selected').removeClass('selected');
            $('.ui.segment.' + click_window).find(".mark-" + click_window + "-selected").removeClass("mark-" + click_window + "-selected");
            $('#' + click_id).addClass("selected");
        }
    }
    /*------------------------------------------------------------------
    [Select and enter item when left mouse click]
    -------------------------------------------------------------------*/
    $("body").on("click", ".itemObject", function() {
        if (modal_open == 1)
            return false;
        if (modal_expand == 1)
            return false;
        modal_expand = 1;
        var mouse_click = $(this).attr('id');
        var mouse_type = $(this).attr("data-type");
        var mouse_url = $(this).attr('data-url');
        // Select function on mouse click
        doMouseClickAction(mouse_click, mouse_type, mouse_url);
        clickURL = $(".selected").attr("data-url");
        clickType = $(".selected").attr("data-type");
        current_id = $('.selected').attr('id');
        // Simulate enter function
        doEnterFunction();
        return true;
    });
    /*------------------------------------------------------------------
    [Only item select when right mouse click]
    -------------------------------------------------------------------*/
    $("body").on("contextmenu", ".itemObject", function(event) {
        event.stopPropagation();
        event.preventDefault();
        // Return if other actions active
        if (modal_open == 1)
            return false;
        if (modal_expand == 1)
            return false;
        var mouse_click = $(this).attr('id');
        var mouse_type = $(this).attr("data-type");
        var mouse_url = $(this).attr('data-url');
        // Select function on mouse click
        doMouseClickAction(mouse_click, mouse_type, mouse_url);
    });
    /*------------------------------------------------------------------
    [Up button clicked]
    -------------------------------------------------------------------*/
    $(".key-up").on("click", function(event) {
        this.blur();
        // Simulate up function
        doUpFunction();
    });
    /*------------------------------------------------------------------
    [Switch button clicked]
    -------------------------------------------------------------------*/
    $(".key-switch").on("click", function(event) {
        this.blur();
        // Simulate switch function
        doSwitchFunction();
    });
    /*------------------------------------------------------------------
    [Down button clicked]
    -------------------------------------------------------------------*/
    $(".key-down").on("click", function(event) {
        this.blur();
        // Simulate down function
        doDownFunction();
    });
    /*------------------------------------------------------------------
    [Simulate up arrow function with key or button]
    -------------------------------------------------------------------*/
    function doUpFunction() {
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        $('#' + current_id).removeClass('selected');
        current_id = current_id.replace(current_window + "-", "");
        // Return if reached top
        if (current_id == 1) {
            $('#' + current_window + "-" + current_id).addClass('selected');
            $('.ui.segment.' + current_window).animate({
                scrollTop: '-=24'
            }, 0);
            return false;
        }
        // Select upper item
        current_id--;
        $('#' + current_window + "-" + current_id).addClass('selected');
        select_position = $(".selected").position();
        select_position_top = select_position.top;
        // Scroll only window till top if reached top
        if (select_position_top < 0)
            $('.ui.segment.' + current_window).animate({
                scrollTop: '-=' + (-1 * select_position_top)
            }, 0);

    }
    /*------------------------------------------------------------------
    [Simulate switch window function with key or button]
    -------------------------------------------------------------------*/
    function doSwitchFunction() {
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        // Switch to window two if one
        if (current_window == "one") {
            if ($('.ui.segment.two').find(".mark-two-selected").length > 0) {
                $(".selected").addClass('mark-one-selected').removeClass('selected');
                $(".mark-two-selected").addClass("selected").removeClass("mark-two-selected");
            } else {
                $(".selected").addClass('mark-one-selected').removeClass('selected');
                $("#two-1").addClass('selected');
            }
            // Switch to window one if two
        } else if (current_window == "two") {
            if ($('.ui.segment.one').find(".mark-one-selected").length > 0) {
                $(".selected").addClass('mark-two-selected').removeClass('selected');
                $(".mark-one-selected").addClass("selected").removeClass("mark-one-selected");
            } else {
                $(".selected").addClass('mark-two-selected').removeClass('selected');
                $("#one-1").addClass('selected');
            }
        }
    }
    /*------------------------------------------------------------------
    [Simulate down arrow function with key or button]
    -------------------------------------------------------------------*/
    function doDownFunction() {
        current_id = $('.selected').attr('id');
        current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
        $('#' + current_id).removeClass('selected');
        current_id = current_id.replace(current_window + "-", "");
        // Select next item when down
        if (current_id == $('#' + current_window + "-count").val()) {
            $('#' + current_window + "-" + current_id).addClass('selected');
            $('.ui.segment.' + current_window).animate({
                scrollTop: '+=24'
            }, 0);
            return false;
        }
        current_id++;
        $('#' + current_window + "-" + current_id).addClass('selected');
        select_position = $(".selected").position();
        select_position_bottom = select_position.top + 24;
        // Scroll window down when last item selected
        if (select_position_bottom > window_position && select_position_bottom < window_position + 24)
            $('.ui.segment.' + current_window).animate({
                scrollTop: '+=' + (12 + select_position_bottom % window_position)
            }, 0);
        else if (select_position_bottom >= window_position + 24)
            $('.ui.segment.' + current_window).animate({
                scrollTop: '+=' + (select_position_bottom - window_position + 12)
            }, 0);
    }
    /*------------------------------------------------------------------
    [Keyboard function to browse window]
    -------------------------------------------------------------------*/
    $("body").keydown(function(event) {
        switch (event.keyCode) {
            // Keyboard up
            case 38:
                if (modal_expand == 1)
                    break;
                if (modal_open == 1)
                    break;
                event.preventDefault();
                // Simulate up function
                doUpFunction();
                break;
                // Keyboard down
            case 40:
                if (modal_expand == 1)
                    break;
                if (modal_open == 1)
                    break;
                event.preventDefault();
                // Simulate down function
                doDownFunction();
                break;
                // Pageup key
            case 33:
                if (modal_expand == 1)
                    break;
                if (modal_open == 1)
                    break;
                event.preventDefault();
                // Simulate pageup function
                current_id = $('.selected').attr('id');
                current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
                $('#' + current_id).removeClass('selected');
                $('#' + current_window + "-1").addClass('selected');
                $('.ui.segment.' + current_window).animate({
                    scrollTop: '-=' + $('.ui.segment.' + current_window + '').prop("scrollHeight")
                }, 0);
                break;
                // Pagedown key
            case 34:
                if (modal_expand == 1)
                    break;
                if (modal_open == 1)
                    break;
                event.preventDefault();
                // Simulate padedown function
                current_id = $('.selected').attr('id');
                current_window = (current_id.indexOf("one") >= 0) ? 'one' : 'two';
                $('#' + current_id).removeClass('selected');
                $('#' + current_window + "-" + $('#' + current_window + "-count").val()).addClass('selected');
                $('.ui.segment.' + current_window).animate({
                    scrollTop: '+=' + $('.ui.segment.' + current_window + '').prop("scrollHeight")
                }, 0);
                break;
                // Tab key
            case 9:
                event.preventDefault();
                // Tab if textarea if file opened
                if (modal_open == 1) {
                    break;
                }
                if (modal_expand == 1)
                    break;
                if (mobile_device == 1)
                    break;
                // Simulate window switch function
                doSwitchFunction();
                break;
                // Enter key
            case 13:
                clickURL = $(".selected").attr("data-url");
                clickType = $(".selected").attr("data-type");
                if (modal_open == 1)
                    break;
                if (modal_expand == 1)
                    break;
                modal_expand = 1;
                // Simulate enter function
                doEnterFunction();
                break;
        }
    });
    /*------------------------------------------------------------------
    [About Web Commander]
    -------------------------------------------------------------------*/
    $('.ui.info.button').popup({
        position: 'bottom center',
        content: 'About Web Commander'
    });
    /*------------------------------------------------------------------
    [Access permission button]
    -------------------------------------------------------------------*/
    $('.ui.permission.button').popup({
        position: 'bottom center',
        content: 'Set Permission'
    });
    /*------------------------------------------------------------------
    [Touch keyboard button]
    -------------------------------------------------------------------*/
    $('.ui.keyboard.button').popup({
        position: 'bottom center',
        content: 'Navigation Buttons'
    });
    /*------------------------------------------------------------------
    [User settings button]
    -------------------------------------------------------------------*/
    $('.ui.user.button').popup({
        position: 'bottom center',
        content: 'User Settings'
    });
    /*------------------------------------------------------------------
    [Sign out button]
    -------------------------------------------------------------------*/
    $('.ui.logout.button').popup({
        position: 'bottom center',
        content: 'Sign Out'
    });
    /*------------------------------------------------------------------
    [Copy file/folder button]
    -------------------------------------------------------------------*/
    $('.ui.copy-action.button').popup({
        position: 'top center',
        content: 'Copy file/folder'
    });
    /*------------------------------------------------------------------
    [Move file/folder button]
    -------------------------------------------------------------------*/
    $('.ui.move-action.button').popup({
        position: 'top center',
        content: 'Move file/folder'
    });
    /*------------------------------------------------------------------
    [Upload file/folder button]
    -------------------------------------------------------------------*/
    $('.ui.upload-action.button').popup({
        position: 'top center',
        content: 'Upload file/folder'
    });
    /*------------------------------------------------------------------
    [Zip file/folder button]
    -------------------------------------------------------------------*/
    $('.ui.zip-action.button').popup({
        position: 'top center',
        content: 'Zip file/folder'
    });
    /*------------------------------------------------------------------
    [Download file button]
    -------------------------------------------------------------------*/
    $('.ui.download-action.button').popup({
        position: 'top center',
        content: 'Download file'
    });
    /*------------------------------------------------------------------
    [Create file/folder button]
    -------------------------------------------------------------------*/
    $('.ui.create-action.button').popup({
        position: 'top center',
        content: 'Create file/folder'
    });
    /*------------------------------------------------------------------
    [Trash file/folder button]
    -------------------------------------------------------------------*/
    $('.ui.trash-action.button').popup({
        position: 'top center',
        content: 'Delete file/folder'
    });
    /*------------------------------------------------------------------
    [Rename file/folder button]
    -------------------------------------------------------------------*/
    $('.ui.rename-action.button').popup({
        position: 'top center',
        content: 'Rename file/folder'
    });
    /*------------------------------------------------------------------
    [Search file button]
    -------------------------------------------------------------------*/
    $('.ui.search-action.button').popup({
        position: 'top center',
        content: 'Search file'
    });