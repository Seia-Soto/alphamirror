$(function() {
	$("body").on("click","#editBtn",function (event) {
		event.preventDefault();
		var $ef = $("#editForm");

		if (!$("#editForm #agreeCheckbox").is(":checked")) {
			alert("수정하기 전에 먼저 문서 배포 규정에 동의해 주세요.");
			return;
		}

		$ef.attr({
			"method": "POST",
			"target": "",
			"action": null
		});
		window.onbeforeunload = null;
		if($ef.children('#recaptcha').length) recaptchaExecute($ef.attr('data-recaptcha'));
		else $ef.submit();
	});

	$("body").on("change", "#textInput", function () {
		if(window.onbeforeunload) return;
		window.onbeforeunload = function(e) {
			return '';
		};
	});

	$("body").on("click","#previewLink",function (event) {
		event.preventDefault();
		var $ef = $("#editForm"), $pf = $("#previewFrame");

		if ($pf.length > 0) {
			$pf.remove();
		}

		$pf = $("<iframe></iframe>").attr({
			"name": "previewFrame",
			"id": "previewFrame"
		});

		$(".tab-pane#preview").append($pf);

		$ef.attr({
			"method": "POST",
			"target": "previewFrame",
			"action": "/preview/" + encodeURIComponent($ef.attr('data-title'))
		});
		$ef.submit();
	});


	$("body").on("submit", "#deleteForm", function (event) {
		var val = $("#deleteForm #logInput").val();
		if (val.length < 5) {
			alert("5자 이상의 요약을 입력해 주세요.");
			return false;
		}
		if (!$("#deleteForm #agreeCheckbox").is(":checked")) {
			alert("문서 삭제에 대한 안내를 확인해 주세요.");
			return false;
		}
		if(!$('#submitBtn').attr('disabled') &&
			$("#deleteForm #recaptcha").length) {
			recaptchaExecute($("#deleteForm").attr('data-recaptcha'));
			return false;
		}
	});

	$("body").on("submit", "#moveForm", function (event) {
		var val = $("#moveForm #titleInput").val();
		if (val.length < 1) {
			alert("변경할 문서 제목을 입력해 주세요.");
			return false;
		}
		val = $("#moveForm #logInput").val();
		if (val.length < 5) {
			alert("5자 이상의 요약을 입력해 주세요.");
			return false;
		}
		if(!$('#moveBtn').attr('disabled') &&
			$("#moveForm #recaptcha").length) {
			recaptchaExecute($("#moveForm").attr('data-recaptcha'));
			return false;
		}
	});

	$("body").on("change", "#fileInput", function () {
		var file = $(this)[0].files[0];
		if (!file.type.match(/image.*/)) {
			$(this).val('');
			alert('이미지가 아닙니다.');
			return;
		}
		var path = $(this).val().split('\\');
		if(!$("#documentInput").val()) {
			var filename = path[path.length - 1].split(".");
			filename[filename.length - 1] = filename[filename.length - 1].toLowerCase();
			filename = filename.join(".");
			$("#documentInput").val("파일:" + filename);
		}
		$("#fakeFileInput").val($(this).val());
	});

	$("body").on("click", "#fakeFileInput, #fakeFileButton", function () {
		$("#fileInput").click();
	});

	$("body").on("submit", "#uploadForm", function() {
		var licenseSelect = $('#licenseSelect');
		var categorySelect = $('#categorySelect');
		var textInput = $('#textInput');
		if(licenseSelect.length) {
			var license = licenseSelect.val();
			if(!license) {
				alert("올바른 라이선스를 선택해주세요.");
				return false;
			}
		}
		if(categorySelect.length) {
			var category = categorySelect.val();
			if(!category) {
				alert("올바른 분류를 선택해주세요.");
				return false;
			}
		}
		if(licenseSelect.length && categorySelect.length) {
			var header = '[include(' + license + ')]\n' + '[[' + category + ']]';
			var content = textInput.val();
			if(content.indexOf(header) === -1) {
				textInput.val(header + '\n' + content);
			}
		}

		if(!$('#uploadBtn').attr('disabled') &&
			$("#uploadForm #recaptcha").length) {
			recaptchaExecute($("#uploadForm").attr('data-recaptcha'));
			return false;
		}

		return true;
	});
	$("body").on('click', 'dl.wiki-folding dt', function() {
		var content = $(this).parent().find("> dd");
		content.toggle('fast');
	});
	$(".wiki-heading").css("cursor","pointer").click(function(e) {
		if(e.target.tagName === 'A') return;
		$(this).next().toggle();
	});
	$(".seed-acl-div").each(function() {
		var div = $(this);
		var type = div.attr('data-type');
		var isNS = div.attr('data-isns') === 'true';
		var editable = div.attr('data-editable') === 'true';
		if(!editable) return;
		var tbody = div.find('.seed-acl-tbody');
		var addCondType = div.find('.seed-acl-add-condition-type');
		var addCondValuePerm = div.find('.seed-acl-add-condition-value-perm');
		var addCondValue = div.find('.seed-acl-add-condition-value');
		var addAction = div.find('.seed-acl-add-action');
		var addExpire = div.find('.seed-acl-add-expire');
		var addBtn = div.find('.seed-acl-add-btn');
		var addForms = div.find('INPUT, .seed-acl-add-btn, SELECT');

		function reloadTBody(data) {
			tbody.empty();
			tbody.html(data);
			bindDeleteBtn();
		}
		function alertAjaxError(data) {
			try {
				if(data && data.responseText) {
					var o = JSON.parse(data.responseText);
					if(o && o.status) {
						alert(o.status);
						return;
					}
				}
			} catch(e) {}
			alert('문제가 발생했습니다!');
		}
		function bindDeleteBtn() {
			tbody.find("tr").each(function() {
				var tr = $(this);
				var id = tr.attr('data-id');
				var btn = tr.find('button');
				btn.click(function() {
					if(!confirm("삭제하시겠습니까?")) return;
					btn.attr('disabled', true);
					$.ajax({
						type: "POST",
						data: {
							mode: 'delete',
							type: type,
							isNS: isNS ? 'Y' : undefined,
							id: id
						},
						dataType: 'text',
						success: function(data) {
							reloadTBody(data);
						},
						error: alertAjaxError
					});
				});
			});
		}
		bindDeleteBtn();
		addCondType.change(function onChangeCondType() {
			if(addCondType.val() === 'perm') {
				addCondValuePerm.show();
				addCondValue.hide();
			} else {
				addCondValue.show();
				addCondValuePerm.hide();
				addCondValue.val('');
			}
			return onChangeCondType;
		}());
		addBtn.click(function() {
			var condType = addCondType.val();
			var condVal = condType === 'perm' ? addCondValuePerm.val() : addCondValue.val();
			if(!condVal) {
				alert('값이 없습니다.');
				return;
			}
			addForms.attr('disabled', true);
			$.ajax({
				type: "POST",
				data: {
					mode: 'insert',
					type: type,
					isNS: isNS ? 'Y' : undefined,
					condition: condType + ":" + condVal,
					action: addAction.val(),
					expire: addExpire.val()
				},
				dataType: 'text',
				success: function(data) {
					addForms.removeAttr("disabled");
					addCondValue.val('');
					reloadTBody(data);
				},
				error: function(data) {
					alertAjaxError(data);
					addForms.removeAttr("disabled");
				}
			});
		});
		tbody.sortable({
			update: function(event, ui) {
				var id = ui.item.attr('data-id');
				if(!id) return;
				var after_id = ui.item.prev().attr('data-id');
				tbody.sortable('disable');
				$.ajax({
					type: "POST",
					data: {
						mode: 'move',
						isNS: isNS ? 'Y' : undefined,
						type: type,
						id: id,
						after_id: after_id ? after_id : 0
					},
					dataType: 'text',
					success: function(data) {
						tbody.sortable('enable');
						reloadTBody(data);
					},
					error: alertAjaxError
				});
			}
		});
	});
});
(function() {
	function historyInit(docName) {
		$('INPUT[name=oldrev], INPUT[name=rev]').click(function() {
			var oldrev = $('INPUT[name=oldrev]:checked').val();
			if(oldrev) {
				oldrev = parseInt(oldrev);
				$('INPUT[name=rev]').each(function() {
					if( parseInt($(this).val()) <= oldrev) {
						$(this).attr('checked', false);
						$(this).css('visibility', 'hidden');
					} else {
						$(this).css('visibility', 'visible');
					}
				});
			}
			var rev = $('INPUT[name=rev]:checked').val();
			if(rev) {
				rev = parseInt(rev);
				$('INPUT[name=oldrev]').each(function() {
					if( parseInt($(this).val()) >= rev) {
						$(this).attr('checked', false);
						$(this).css('visibility', 'hidden');
					} else {
						$(this).css('visibility', 'visible');
					}
				});
			}
		});
		$('#diffbtn').click(function() {
			var oldrev = $('INPUT[name=oldrev]:checked').val();
			var rev = $('INPUT[name=rev]:checked').val();
			if(oldrev && rev) {
				if(window.pjaxCall) window.pjaxCall('/diff/' + docName + '?oldrev='+ oldrev + '&rev=' + rev);
				else location.href = '/diff/' + docName + '?oldrev='+ oldrev + '&rev=' + rev;
			}
		});
	}

	var discussFetchWorking = [];
	var discussPolling = false;
	var discussTimer = null;
	var discussTimer2 = null;
	var discussXhr = null;
	var discussXhr2 = null;
	var discussLastObserveTime = 0;
	var discussObserver = new IntersectionObserver(function (entries) {
		if(!discussPolling) return;
		discussLastObserveTime = Date.now();
		for(var i = 0; i < entries.length; i++) {
			entries[i].target.setAttribute('data-visible', entries[i].isIntersecting);
		}
	});

	function discussFetch(topic) {
		var visibleDom = document.querySelector('#res-container div.res-loading[data-visible=\"true\"][data-locked=\"false\"]');
		if(!visibleDom) return;
		visibleDom.setAttribute('data-locked', 'true');
		var reqId = visibleDom.getAttribute('data-id');
		discussXhr2 = $.ajax({
			type: "GET",
			url: "/thread/" + topic + "/" + reqId,
			async: true,
			dataType: 'html',
			error: function() {
				discussXhr2 = null;
				if(!discussPolling) return;
				location.reload();
			},
			success: function(data) {
				discussXhr2 = null;
				if(!discussPolling) return;
				discussLastObserveTime = Date.now();
				var dataObj = $(data);
				dataObj.find("time").each(function () {
					var format = $(this).attr("data-format");
					var time = $(this).attr("datetime");
					$(this).text(formatDate(new Date(time), format));
				});
				dataObj.each(function() {
					var thisObj = $(this);
					var targetObj = $('#res-container div.res-loading[data-id="' + thisObj.data('id') + '"]');
					targetObj.after(thisObj);
					targetObj.remove();
				});
			}
		});
	}

	function discussPollCancel() {
		discussPolling = false;
		if(discussTimer) clearTimeout(discussTimer);
		discussTimer = null;
		if(discussTimer2) clearInterval(discussTimer2);
		discussTimer2 = null;
		if(discussXhr) discussXhr.abort();
		if(discussXhr2) discussXhr2.abort();
	}


	function discussPoll(topic) {
		if(!discussPolling) return;
		function discussPollReserve(interval) {
			discussTimer = setTimeout(function() {
				discussTimer = null;
				if(!discussPolling) return;
				discussPoll(topic);
			}, interval);
		}
		discussXhr = $.ajax({
			type: "POST",
			url: "/notify/thread/" + topic,
			async: true,
			cache: false,
			timeout: 20000,
			dataType: 'json',
			success: function(data) {
				discussXhr = null;
				if(!discussPolling) return;
				if(data.status !== 'event') return discussPollReserve(100);
				var resDoms = document.querySelectorAll("#res-container div.res-wrapper");
				var lastId = resDoms.length ? (resDoms[resDoms.length - 1].getAttribute('data-id') | 0) : 0;
				var resContainer = document.querySelector("#res-container");
				for(var i = lastId + 1; i <= data.comment_id; i++) {
					var res = $('<div class="res-wrapper res-loading" data-id="' + i + '" data-locked="false"><div class="res res-type-normal"><div class="r-head"><span class="num"><a id="#' + i + '">#' + i + '</a>&nbsp;</span></div><div class="r-body"></div></div></div>');
					res.appendTo(resContainer);
					discussObserver.observe(res[0]);
				}
				discussPollReserve(1);
			},
			error: function() {
				discussXhr = null;
				if(!discussPolling) return;
				discussPollReserve(100);
			}
		});
	}
	function discussPollStart(topic) {
		discussPolling = true;
		$('#new-thread-form').submit(function() {
			var self = $(this);
			if(!self.find("TEXTAREA").val()) return false;
			var data = self.serialize();
			self.find("BUTTON, TEXTAREA").attr("disabled", "disabled");
			$.ajax({
				type: "POST",
				url: "/thread/" + topic,
				data: data,
				dataType: 'json',
				success: function(data) {
					self.find("BUTTON, TEXTAREA").removeAttr("disabled");
					self.find("TEXTAREA").val('');
				},
				error: function(data) {
					alert((data && data.responseJSON && data.responseJSON.status) ? data.responseJSON.status :'문제가 발생했습니다!');
					self.find("BUTTON, TEXTAREA").removeAttr("disabled");
				}
			});
			return false;
		});
		$('#thread-status-form').submit(function() {
			var self = $(this);
			var data = self.serialize();
			self.find("BUTTON").attr("disabled", "disabled");
			$.ajax({
				type: "POST",
				url: "/admin/thread/" + topic + "/status",
				data: data,
				dataType: 'json',
				success: function(data) {
					self.find("BUTTON").removeAttr("disabled");
					location.reload();
				},
				error: function(data) {
					alert((data && data.responseJSON && data.responseJSON.status) ? data.responseJSON.status :'문제가 발생했습니다!');
					self.find("BUTTON").removeAttr("disabled");
				}
			});
			return false;
		});
		$('#thread-document-form').submit(function() {
			var self = $(this);
			var data = self.serialize();
			self.find("BUTTON").attr("disabled", "disabled");
			$.ajax({
				type: "POST",
				url: "/admin/thread/" + topic + "/document",
				data: data,
				dataType: 'json',
				success: function(data) {
					self.find("BUTTON").removeAttr("disabled");
					location.reload();
				},
				error: function(data) {
					alert((data && data.responseJSON && data.responseJSON.status) ? data.responseJSON.status :'문제가 발생했습니다!');
					self.find("BUTTON").removeAttr("disabled");
				}
			});
			return false;
		});
		$('#thread-topic-form').submit(function() {
			var self = $(this);
			var data = self.serialize();
			self.find("BUTTON").attr("disabled", "disabled");
			$.ajax({
				type: "POST",
				url: "/admin/thread/" + topic + "/topic",
				data: data,
				dataType: 'json',
				success: function(data) {
					self.find("BUTTON").removeAttr("disabled");
					location.reload();
				},
				error: function(data) {
					alert((data && data.responseJSON && data.responseJSON.status) ? data.responseJSON.status :'문제가 발생했습니다!');
					self.find("BUTTON").removeAttr("disabled");
				}
			});
			return false;
		});
		discussPoll(topic);
		$("#res-container div.res-loading").each(function () {
			discussObserver.observe(this);
		});
		discussTimer2 = setInterval(function () {
			if ((discussLastObserveTime + 100) < Date.now() && !discussXhr2 ) {
				discussFetch(topic);
			}
		}, 100);
	}

	var recaptchaInitCallbacks = [];

	function recaptchaInit(id, opt, cb) {
		if(window.grecaptcha) {
			var id = window.grecaptcha.render(id, opt);
			if(cb) cb(id);
			return;
		}
		recaptchaInitCallbacks.push(recaptchaInit.bind(null, id, opt, cb));
	}

	function recaptchaExecute(id) {
		if(id && window.grecaptcha) return window.grecaptcha.execute(id);
		alert('recaptcha error');
	}

	function recaptchaOnLoad() {
		for(var i = 0; i < recaptchaInitCallbacks.length; i++) recaptchaInitCallbacks[i]();
		recaptchaInitCallbacks = [];
	}
	jQuery(function() {
		$("time").each(function () {
			var format = $(this).attr("data-format");
			var time = $(this).attr("datetime");
	
			if (!format || !time) {
				return;
			}
			$(this).text(formatDate(new Date(time), format));
		});
	});
	window.historyInit = historyInit;
	window.discussPollCancel = discussPollCancel;
	window.discussPollStart = discussPollStart;
	window.recaptchaInit = recaptchaInit;
	window.recaptchaExecute = recaptchaExecute;
	window.recaptchaOnLoad = recaptchaOnLoad;
})();

