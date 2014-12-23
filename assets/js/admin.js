$(document).ready(function() {
	$('#type').change(function() {
		setTypeFilter($(this).val());
		updateMacroList(0);
	});

	$('#site_id').change(function() {
		updateMacroList(0);
	});

	$('#subspecialty_id').change(function() {
		updateMacroList(0);
	});

	$('#firm_id').change(function() {
		updateMacroList(0);
	});

	$('#name').change(function() {
		updateMacroList(1);
	});

	$('#episode_status_id').change(function() {
		updateMacroList(1);
	});

	$('.addLetterMacro').click(function(e) {
		e.preventDefault();

		window.location.href = baseUrl + '/OphCoCorrespondence/admin/addMacro';
	});

	handleButton($('.cancelEditMacro'),function(e) {
		e.preventDefault();

		window.location.href = baseUrl = '/OphCoCorrespondence/admin/letterMacros';
	});

	$('#LetterMacro_type').change(function() {
		setTypeFilter($(this).val());
	});

	$('#LetterMacro_body').select(function() {
		if ($(this)[0].selectionStart != undefined) {
			var text = $(this).val().substring($(this)[0].selectionStart-1,$(this)[0].selectionEnd+1);

			var m = text.match(/^\[([a-z]{3})\]$/);

			if (m) {
				$.ajax({
					'type': 'GET',
					'url': baseUrl + '/patient/shortCodeDescription?shortcode=' + m[1],
					'success': function(description) {
						$('.shortCodeDescription').html(description);
					}
				});
			} else {
				$('.shortCodeDescription').html('&nbsp;');
			}
		} else {
			$('.shortCodeDescription').html('&nbsp;');
		}
	});

	$('#LetterMacro_body').unbind('keyup').bind('keyup',function() {
		macro_cursor_position = $(this).prop('selectionEnd');
	});

	$('#shortcode').change(function() {
		if ($(this).val() != '') {
			var current = $('#LetterMacro_body').val();

			$('#LetterMacro_body').val(current.substring(0,macro_cursor_position) + '[' + $(this).val() + ']' + current.substring(macro_cursor_position,current.length));
			$(this).val('');
		}
	});

	macro_cursor_position = $('#LetterMacro_body').val().length;
});

var macro_cursor_position = 0;

function setTypeFilter(type)
{
	var site = 0;
	var subspecialty = 0;
	var firm = 0;

	switch (type) {
		case 'site':
			site = 1; break;
		case 'subspecialty':
			subspecialty = 1; break;
		case 'firm':
			firm = 1; break;
	}

	if (site) {
		$('.typeSite').show();
	} else {
		$('.typeSite').hide();
		$('#site_id').val('');
	}

	if (subspecialty) {
		$('.typeSubspecialty').show();
	} else {
		$('.typeSubspecialty').hide();
		$('#subspecialty_id').val('');
	}

	if (firm) {
		$('.typeFirm').show();
	} else {
		$('.typeFirm').hide();
		$('#firm_id').val('');
	}
}

function updateMacroList(preserve)
{
	$('#admin_letter_macros tbody').html('<tr><td colspan="10">Searching...</td></tr>');

	var name = $('#name').val();
	var episode_status_id = $('#episode_status_id').val();

	$.ajax({
		'type': 'GET',
		'url': baseUrl + '/OphCoCorrespondence/admin/filterMacros?type=' + $('#type').val() + '&site_id=' + $('#site_id').val() + '&subspecialty_id=' + $('#subspecialty_id').val() + '&firm_id=' + $('#firm_id').val() + '&name=' + name + '&episode_status_id=' + episode_status_id,
		'success': function(html) {
			$('#admin_letter_macros tbody').html(html);
		}
	});

	$.ajax({
		'type': 'GET',
		'url': baseUrl + '/OphCoCorrespondence/admin/filterMacroNames?type=' + $('#type').val() + '&site_id=' + $('#site_id').val() + '&subspecialty_id=' + $('#subspecialty_id').val() + '&firm_id=' + $('#firm_id').val(),
		'success': function(html) {
			$('#name').html(html);

			if (preserve) {
				$('#name').val(name);
			}
		}
	});

	$.ajax({
		'type': 'GET',
		'url': baseUrl + '/OphCoCorrespondence/admin/filterEpisodeStatuses?type=' + $('#type').val() + '&site_id=' + $('#site_id').val() + '&subspecialty_id=' + $('#subspecialty_id').val() + '&firm_id=' + $('#firm_id').val(),
		'success': function(html) {
			$('#episode_status_id').html(html);

			if (preserve) {
				$('#episode_status_id').val(episode_status_id);
			}
		}
	});
}
