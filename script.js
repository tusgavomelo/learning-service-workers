var swRegistration;
var firebasePublicKey = 'BLNCfGrgf7e8Ykd_YbT8qEIt-OazDofNB_emrJr5vccwYTL8RIn0SYpSl7XiKP_j8y4roGMFrAchFuC1IoKVKhs';
var appServerKey = urlB64ToUint8Array(firebasePublicKey);
var isSubscribed = false;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');


  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// register the service worker
navigator.serviceWorker.register('sw.js', {scope: '/sw-test/'})
.then(function (register) {
	console.log('service worker is registered', register);

	swRegistration = register;
	initaliseUI();
})
.catch(function (err) {
	console.log('can`t register service worker', err);
});

function initaliseUI() {
	var togglePushButton = document.querySelector('.toggle-push-button');

	togglePushButton.addEventListener('click', function(e) {
		if (isSubscribed) {
			unsubscribeUser();
		} else {
			subscribeUser();
		}
	});
}

function subscribeUser() {
	var subscribeOptions = {
		userVisibleOnly: true,
		applicationServerKey: appServerKey
	}

	swRegistration.pushManager.subscribe(subscribeOptions)
	.then(function (subscription) {
		console.log('service worker is subscribed', subscription);

		isSubscribed = true;
	})
	.catch(function (err) {
		console.log('can`t subscribe service worker', err);
	});
}

function unsubscribeUser() {
	swRegistration.pushManager.getSubscription()
	.then(function(subscription) {
		if (subscription) {
			console.log('service worker unsubscribed');
			subscription.unsubscribe();
			isSubscribed = false;
		}
	})
	.catch(function(err) {
		console.log('can`t unsubscribed', err);
	});
}