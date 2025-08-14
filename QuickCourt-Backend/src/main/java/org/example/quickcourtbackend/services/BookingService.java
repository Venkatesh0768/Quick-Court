package org.example.quickcourtbackend.services;

import org.example.quickcourtbackend.dtos.BookingRequestDto;
import org.example.quickcourtbackend.dtos.BookingResponseDto;
import org.example.quickcourtbackend.repositories.BookingRepository;
import org.example.quickcourtbackend.repositories.CourtRepository;
import org.example.quickcourtbackend.repositories.UserRepository;
import org.example.quickcourtbackend.enums.BookingStatus;
import org.example.quickcourtbackend.enums.PaymentStatus;
import org.example.quickcourtbackend.models.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {


    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourtRepository courtRepository;


    public BookingResponseDto createBooking(BookingRequestDto dto) {
        Booking booking = new Booking();
        booking.setUser(userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
        booking.setCourt(courtRepository.findById(dto.getCourtId())
                .orElseThrow(() -> new RuntimeException("Court not found")));
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setDuration(dto.getDuration());
        booking.setStatus(BookingStatus.valueOf(dto.getStatus()));
        booking.setPaymentStatus(PaymentStatus.valueOf(dto.getPaymentStatus()));

        Booking saved = bookingRepository.save(booking);
        return mapToResponseDto(saved);
    }

    public BookingResponseDto getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponseDto(booking);
    }


    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }


    public BookingResponseDto updateBooking(String id, BookingRequestDto dto) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setUser(userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
        booking.setCourt(courtRepository.findById(dto.getCourtId())
                .orElseThrow(() -> new RuntimeException("Court not found")));
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setDuration(dto.getDuration());
        booking.setStatus(BookingStatus.valueOf(dto.getStatus()));
        booking.setPaymentStatus(PaymentStatus.valueOf(dto.getPaymentStatus()));

        Booking updated = bookingRepository.save(booking);
        return mapToResponseDto(updated);
    }


    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    private BookingResponseDto mapToResponseDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setUserId(String.valueOf(booking.getUser()));
        dto.setCourtId(String.valueOf(booking.getCourt()));
        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setDuration(booking.getDuration());
        dto.setStatus(booking.getStatus().name());
        dto.setPaymentStatus(booking.getPaymentStatus().name());
        return dto;
    }
}
