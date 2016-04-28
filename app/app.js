var React = require('react');
var ReactDOM = require('react-dom');

var Tweet = React.createClass({
    render: function() {
        return (
            <span>
                <p>
                    <a href="https://twitter.com/{ this.props.tweet.user.sceen_name }">@{ this.props.tweet.user.screen_name }</a> tweeted "<b>{ this.props.tweet.text }</b>" on { this.props.tweet.created_at }.
                </p>
            </span>
        );
    }
});

var Tweets = React.createClass({
    render: function() {
        return (
            <div class="tweets">
                { this.props.tweets.map(function(tweet) {
                    return (
                        <Tweet tweet={ tweet } />
                    )
                })}
            </div>
        );
    }
});

angular.module('app', ['ui.router'])

.config(['$stateProvider', function($stateProvider){
    $stateProvider
        .state('base', {
            url: '/',
            templateUrl: 'index.html'
        })
        .state('angular', {
            url: '/angular',
            templateUrl: 'angular.html',
            controller: 'Twitters'
        })
        .state('react', {
            url: '/react',
            templateUrl: 'react.html',
            controller: 'Twitters'
        });
}])

.controller("Twitters", ['$scope', '$http', function($scope, $http) {
    $scope.tweets = []
    $http.get('tweets.json')
        .then(function(res) {
            $scope.tweets = res.data;
        });
}])

.directive("tweet", function() {
    return {
        restrict: 'E',
        template: `
        <span>
            <p>
                <a href="https://twitter.com/{{tweet.user.sceen_name}}">@{{tweet.user.screen_name}}</a> tweeted "<b>{{ tweet.text }}</b>" on {{tweet.created_at}}.
            </p>
        </span>
        `
    }
})

.directive("reactTweets", function() {
    return {
        restrict: 'E',
        scope: {
            tweets: '=tweets'
        },
        link: function (scope, elem, attrs){
            scope.$watch('tweets', function(newValue, oldValue){
                ReactDOM.render(
                    <Tweets tweets={ newValue } />,
                    elem[0]
                );
            });
        }
    }
});
