VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "גיליון1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = True
Sub hebrewCommercial13()
    Dim row As Double, colIndex As Double
    Dim Drink1 As String, Drink2 As String, Drink3 As String, Drink4 As String, Drink5 As String, Drink6 As String, Drink7 As String
    Dim Eat1 As String, Eat2 As String, Eat3 As String, Eat4 As String, Eat5 As String, Eat6 As String, Eat7 As String
    
    colIndex = 1
    row = 1
     
  
    Do While colIndex <= 6
        Do While row <= 24
           If InStr(Cells(colIndex, row).Value, "שבתאי") Then
               Drink4 = Drink4 + "s_xx#d_0" + colIndex + "__h_" + row + "__p_0360+"
           ElseIf InStr(Cells(colIndex, row).Value, "צדק") Then
               Drink1 = Drink1 + "s_xx#d_0" + colIndex + "__h_" + row + "__p_0360+"
           ElseIf InStr(Cells(colIndex, row).Value, "מאדים") Then
               Drink2 = Drink2 + "s_xx#d_0" + colIndex + "__h_" + row + "__p_0360+"
           ElseIf InStr(Cells(colIndex, row).Value, "חמה") Then
               Drink3 = Drink3 + "s_xx#d_0" + colIndex + "__h_" + row + "__p_0360+"
           ElseIf InStr(Cells(colIndex, row).Value, "נוגה") Then
               Drink4 = Drink4 + "s_xx#d_0" + colIndex + "__h_" + row + "__p_0360+"
           ElseIf InStr(Cells(colIndex, row).Value, "נוגה") Then
               Drink5 = Drink5 + "s_xx#d_0" + colIndex + "__h_" + row + "__p_0360+"
           End If
           row = row + 1
        Loop
        colIndex = colIndex + 1
    Loop
End Sub
