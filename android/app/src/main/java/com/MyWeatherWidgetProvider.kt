package com.anonymous.gione

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import android.content.SharedPreferences

class MyWeatherWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs: SharedPreferences =
            context.getSharedPreferences("AsyncStorage", Context.MODE_PRIVATE)

        val city = prefs.getString("weather_city", "도시 없음")
        val temp = prefs.getString("weather_temp", "--°")

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_weather)
            views.setTextViewText(R.id.widget_city, city)
            views.setTextViewText(R.id.widget_temp, temp)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
